'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';

type Director = {
  name: string;
  dob: string;
  drivers_licence_no: string;
  state: string;
  phone: string;
  address: string;
};

type DirectorErrors = Record<keyof Director, string>;

const createEmptyDirector = (): Director => ({
  name: '',
  dob: '',
  drivers_licence_no: '',
  state: 'QLD',
  phone: '',
  address: '',
});

const createEmptyDirectorErrors = (): DirectorErrors => ({
  name: '',
  dob: '',
  drivers_licence_no: '',
  state: '',
  phone: '',
  address: '',
});

const directorServerFieldMap: Record<string, keyof Director> = {
  name: 'name',
  dob: 'dob',
  drivers_licence_no: 'drivers_licence_no',
  state: 'state',
  phone: 'phone',
  phone_number: 'phone',
  home_address: 'address',
  address: 'address',
};

type TradeReference = {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
};

type TradeReferenceErrors = Record<keyof TradeReference, string>;

const createEmptyTradeReference = (): TradeReference => ({
  fullName: '',
  companyName: '',
  phone: '',
  email: '',
});

const createEmptyTradeReferenceErrors = (): TradeReferenceErrors => ({
  fullName: '',
  companyName: '',
  phone: '',
  email: '',
});

const tradeReferenceServerFieldMap: Record<string, keyof TradeReference> = {
  fullName: 'fullName',
  full_name: 'fullName',
  name: 'fullName',
  companyName: 'companyName',
  company_name: 'companyName',
  company: 'companyName',
  phone: 'phone',
  phone_number: 'phone',
  contact_number: 'phone',
  email: 'email',
};

const extractErrorPayload = (responseData: unknown) => {
  if (!responseData || typeof responseData !== 'object') {
    return null;
  }
  const dataObj = responseData as Record<string, unknown>;
  const payload =
    dataObj.error && typeof dataObj.error === 'object'
      ? (dataObj.error as Record<string, unknown>)
      : dataObj;
  return payload;
};

const formatSubmitErrors = (
  formErrs: Record<string, string>,
  directorErrs?: DirectorErrors[],
  tradeErrs?: TradeReferenceErrors[]
) => {
  const messages: string[] = [];
  Object.values(formErrs || {}).forEach((msg) => msg && messages.push(msg));
  directorErrs?.forEach((errObj) =>
    Object.values(errObj || {}).forEach((msg) => msg && messages.push(msg))
  );
  tradeErrs?.forEach((errObj) =>
    Object.values(errObj || {}).forEach((msg) => msg && messages.push(msg))
  );
  return messages.join(' | ');
};

export default function TradeApplicationPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [businessStructure, setBusinessStructure] = useState('Sole Trader');
  const [industryType, setIndustryType] = useState('');
  const [accountTerms, setAccountTerms] = useState('7_days');

  const [form, setForm] = useState<{ [key: string]: string }>({
    abn: '',
    acn: '',
    registeredAddress: '',
    businessNature: '',
    inceptionYear: '',
    employees: '',
    legalName: '',
    tradingName: '',
    otherNames: '',
    tradingStreetAddress: '',
    tradingPostCode: '',
    postalAddress: '',
    postalPostCode: '',
    creditLimit: '',
    weeklyTrade: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    accountsName: '',
    accountsEmail: '',
    accountsPhone: '',
    invoiceEmail: '',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({
    abn: '',
    acn: '',
    registeredAddress: '',
    businessNature: '',
    industryType: '',
    inceptionYear: '',
    employees: '',
    legalName: '',
    tradingName: '',
    otherNames: '',
    tradingStreetAddress: '',
    tradingPostCode: '',
    postalAddress: '',
    postalPostCode: '',
    creditLimit: '',
    weeklyTrade: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    accountsName: '',
    accountsEmail: '',
    accountsPhone: '',
    invoiceEmail: '',
    signature: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [directors, setDirectors] = useState<Director[]>([createEmptyDirector()]);
  const [directorErrors, setDirectorErrors] = useState<DirectorErrors[]>([createEmptyDirectorErrors()]);
  const [tradeReferences, setTradeReferences] = useState<TradeReference[]>([
    createEmptyTradeReference(),
    createEmptyTradeReference(),
    createEmptyTradeReference(),
  ]);
  const [tradeReferenceErrors, setTradeReferenceErrors] = useState<TradeReferenceErrors[]>([
    createEmptyTradeReferenceErrors(),
    createEmptyTradeReferenceErrors(),
    createEmptyTradeReferenceErrors(),
  ]);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Signature Canvas Logic
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      const rect = canvasRef.current!.getBoundingClientRect();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      const rect = canvasRef.current!.getBoundingClientRect();
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      setFormErrors((prev) => {
        const next = { ...prev, signature: '' };
        setSubmitError(formatSubmitErrors(next, directorErrors, tradeReferenceErrors));
        return next;
      });
    }
  };

  const stopDraw = () => {
    setIsDrawing(false);
    canvasRef.current?.getContext('2d')?.beginPath();
  };

  const clearSignature = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setFormErrors((prev) => {
      const next = { ...prev, signature: '' };
      setSubmitError(formatSubmitErrors(next, directorErrors, tradeReferenceErrors));
      return next;
    });
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => {
      const next = { ...prev, [field]: '' };
      setSubmitError(formatSubmitErrors(next, directorErrors, tradeReferenceErrors));
      return next;
    });
  };

  const handleDirectorChange = (index: number, field: keyof Director, value: string) => {
    setDirectors((prev) =>
      prev.map((dir, idx) => (idx === index ? { ...dir, [field]: value } : dir))
    );
    setDirectorErrors((prev) =>
      prev.map((err, idx) => (idx === index ? { ...err, [field]: '' } : err))
    );
  };

  const handleTradeReferenceChange = (index: number, field: keyof TradeReference, value: string) => {
    setTradeReferences((prev) =>
      prev.map((reference, idx) =>
        idx === index ? { ...reference, [field]: value } : reference
      )
    );
    setTradeReferenceErrors((prev) =>
      prev.map((err, idx) => (idx === index ? { ...err, [field]: '' } : err))
    );
  };

  const addDirector = () => {
    setDirectors((prev) => [...prev, createEmptyDirector()]);
    setDirectorErrors((prev) => [...prev, createEmptyDirectorErrors()]);
  };

  const removeDirector = (index: number) => {
    setDirectors((prev) => prev.filter((_, idx) => idx !== index));
    setDirectorErrors((prev) => prev.filter((_, idx) => idx !== index));
  };

  const prepareDirectorsForSubmit = () =>
    directors.map((director) =>
      Object.entries(director).reduce((acc, [key, value]) => {
        acc[key as keyof Director] = value.trim();
        return acc;
      }, {} as Director)
    );

  const prepareTradeReferencesForSubmit = () =>
    tradeReferences.map((reference) =>
      Object.entries(reference).reduce((acc, [key, value]) => {
        acc[key as keyof TradeReference] = value.trim();
        return acc;
      }, {} as TradeReference)
    );

  const isSignatureBlank = () => {
    const canvas = canvasRef.current;
    if (!canvas) return true;
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    return !imageData.data.some((value) => value !== 0);
  };

  const validateForm = () => {
    const nextErrors = Object.keys(formErrors).reduce(
      (acc, key) => {
        acc[key] = '';
        return acc;
      },
      {} as { [key: string]: string }
    );

    const requiredFields = [
      'abn',
      'registeredAddress',
      'businessNature',
      'inceptionYear',
      'employees',
      'legalName',
      'tradingName',
      'creditLimit',
      'weeklyTrade',
      'contactName',
      'contactEmail',
      'contactPhone',
      'accountsName',
      'accountsEmail',
      'accountsPhone',
      'invoiceEmail',
    ];

    const fieldLabels: { [key: string]: string } = {
      abn: 'ABN',
      registeredAddress: 'Registered office address',
      businessNature: 'Nature of business',
      inceptionYear: 'Year of inception',
      employees: 'Employees',
      legalName: 'Legal name',
      tradingName: 'Trading name',
      creditLimit: 'Credit limit requested',
      weeklyTrade: 'Estimated weekly trade amount',
      contactName: 'Contact name',
      contactEmail: 'Contact email',
      contactPhone: 'Contact phone',
      accountsName: 'Accounts name',
      accountsEmail: 'Accounts email',
      accountsPhone: 'Accounts phone',
      invoiceEmail: 'Invoice email',
      industryType: 'Industry type',
    };

    requiredFields.forEach((field) => {
      if (!form[field]?.trim()) {
        const label = fieldLabels[field] || 'This field';
        nextErrors[field] = `${label} is required`;
      }
    });

    if (!industryType) {
      nextErrors.industryType = 'Please select an industry type';
    }

    if (
      businessStructure !== 'Sole Trader' &&
      businessStructure !== 'Partnership' &&
      !form['acn']?.trim()
    ) {
      nextErrors.acn = 'ACN is required for this structure';
    }

    if (isSignatureBlank()) {
      nextErrors.signature = 'Signature is required';
    }

    const abnDigits = form.abn.replace(/\s+/g, '');
    if (abnDigits && !/^\d{11}$/.test(abnDigits)) {
      nextErrors.abn = 'ABN must be 11 digits';
    }

    const acnDigits = form.acn.replace(/\s+/g, '');
    if (acnDigits && !/^\d{9}$/.test(acnDigits)) {
      nextErrors.acn = 'ACN must be 9 digits';
    }

    if (form.inceptionYear && !/^\d{4}$/.test(form.inceptionYear.trim())) {
      nextErrors.inceptionYear = 'Enter a valid year for Year of Inception';
    }

    const numericCurrencyFields = ['creditLimit', 'weeklyTrade'];
    numericCurrencyFields.forEach((field) => {
      if (form[field] && Number.isNaN(Number(form[field]))) {
        switch (field) {
          case 'creditLimit':
            nextErrors[field] = 'Enter a numeric value for Credit Limit';
            break;
          case 'weeklyTrade':
            nextErrors[field] = 'Enter a numeric value for Weekly Trade';
            break;
        }
      }
    });

    if (form.employees) {
      const employeesValue = Number(form.employees);
      if (Number.isNaN(employeesValue) || employeesValue < 0) {
        nextErrors.employees = 'Enter a valid number of employees';
      }
    }

    const emailFields = ['contactEmail', 'accountsEmail', 'invoiceEmail'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailFields.forEach((field) => {
      if (form[field] && !emailRegex.test(form[field])) {
        nextErrors[field] = 'Enter a valid email';
      }
    });

    const referenceErrors = tradeReferences.map(() => createEmptyTradeReferenceErrors());
    let hasReferenceErrors = false;
    tradeReferences.forEach((reference, index) => {
      if (!reference.fullName.trim()) {
        referenceErrors[index].fullName = 'Reference Full Name is required';
        hasReferenceErrors = true;
      }
      if (!reference.companyName.trim()) {
        referenceErrors[index].companyName = 'Reference Company Name is required';
        hasReferenceErrors = true;
      }
      if (!reference.phone.trim()) {
        referenceErrors[index].phone = 'Reference Phone is required';
        hasReferenceErrors = true;
      }
      if (!reference.email.trim()) {
        referenceErrors[index].email = 'Reference Email is required';
        hasReferenceErrors = true;
      } else if (!emailRegex.test(reference.email.trim())) {
        referenceErrors[index].email = 'Enter a valid email';
        hasReferenceErrors = true;
      }
    });

    setFormErrors(nextErrors);
    setSubmitError(formatSubmitErrors(nextErrors, directorErrors, referenceErrors));
    setTradeReferenceErrors(referenceErrors);
    const hasFormErrors = Object.values(nextErrors).some((errorMsg) => !!errorMsg);
    return !hasFormErrors && !hasReferenceErrors;
  };

  const handleDirectorServerErrors = (responseData: unknown) => {
    const payload = extractErrorPayload(responseData);
    if (!payload) return;

    const entries = Object.entries(payload);
    const nextDirectorErrors = directors.map(() => createEmptyDirectorErrors());
    let hasDirectorError = false;

    entries.forEach(([path, value]) => {
      const match = path.match(/^directors\.(\d+)\.(.+)$/);
      if (!match) return;
      const index = Number(match[1]);
      const serverField = match[2];
      const mappedField = directorServerFieldMap[serverField];
      if (mappedField === undefined || !nextDirectorErrors[index]) return;
      const message =
        Array.isArray(value) && value.length
          ? String(value[0])
          : typeof value === 'string'
            ? value
            : '';
      if (!message) return;
      nextDirectorErrors[index][mappedField] = message;
      hasDirectorError = true;
    });

    if (hasDirectorError) {
      setDirectorErrors(nextDirectorErrors);
      setSubmitError(formatSubmitErrors(formErrors, nextDirectorErrors, tradeReferenceErrors));
    }
  };

  const handleTradeReferenceServerErrors = (responseData: unknown) => {
    const payload = extractErrorPayload(responseData);
    if (!payload) return;

    const entries = Object.entries(payload);
    if (!entries.length) return;

    const nextErrors = tradeReferences.map(() => createEmptyTradeReferenceErrors());
    let hasErrors = false;

    entries.forEach(([path, value]) => {
      const match =
        path.match(/^tradeReferences\.(\d+)\.(.+)$/) ||
        path.match(/^trade_references\.(\d+)\.(.+)$/);
      if (!match) return;
      const index = Number(match[1]);
      const serverField = match[2];
      const mappedField = tradeReferenceServerFieldMap[serverField];
      if (mappedField === undefined || !nextErrors[index]) return;
      const message =
        Array.isArray(value) && value.length
          ? String(value[0])
          : typeof value === 'string'
            ? value
            : '';
      if (!message) return;
      nextErrors[index][mappedField] = message;
      hasErrors = true;
    });

    if (hasErrors) {
      setTradeReferenceErrors(nextErrors);
      setSubmitError(formatSubmitErrors(formErrors, directorErrors, nextErrors));
    }
  };

  const handleFormServerErrors = (responseData: unknown) => {
    const payload = extractErrorPayload(responseData);
    if (!payload) return;

    const entries = Object.entries(payload);
    if (!entries.length) return;

    let hasUpdates = false;
    const nextErrors = { ...formErrors };

    entries.forEach(([key, value]) => {
      if (
        key.startsWith('directors.') ||
        key.startsWith('tradeReferences.') ||
        key.startsWith('trade_references.')
      )
        return;
      if (!(key in nextErrors)) return;
      const message =
        Array.isArray(value) && value.length
          ? String(value[0])
          : typeof value === 'string'
            ? value
            : '';
      if (!message) return;
      nextErrors[key] = message;
      hasUpdates = true;
    });

    if (hasUpdates) {
      setFormErrors(nextErrors);
      setSubmitError(formatSubmitErrors(nextErrors, directorErrors, tradeReferenceErrors));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setDirectorErrors(directors.map(() => createEmptyDirectorErrors()));
    setTradeReferenceErrors(tradeReferences.map(() => createEmptyTradeReferenceErrors()));

    const signatureImage = canvasRef.current?.toDataURL('image/png') || '';

    const payload = {
      ...form,
      directors: prepareDirectorsForSubmit(),
      tradeReferences: prepareTradeReferencesForSubmit(),
      businessStructure,
      industryType,
      accountTerms,
      signatureImage,
    };

    axiosInstance
      .post(`/trade-account-application`, payload)
      .then((response) => {
        setSubmitted(true);
        setSubmitError('');
        router.push('/trade-application/success');
      })
      .catch((error) => {
        handleFormServerErrors(error?.response?.data);
        handleDirectorServerErrors(error?.response?.data);
        handleTradeReferenceServerErrors(error?.response?.data);
        const apiMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message;
        setSubmitError(
          apiMessage || 'There was an error submitting the form. Please try again.'
        );
        console.error('There was an error submitting the form!', error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Trade Account Application Form</h1>
          <p className="text-lg text-gray-600">
            Complete the form below to apply for a trade account with Loadlink
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg">
            <p className="font-semibold">✓ Application submitted successfully!</p>
            <p className="text-sm mt-1">We'll review your application and contact you within 2-3 business days.</p>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit}>
          {/* Business Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Business Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ABN *</label>
                <input
                  type="text"
                  value={form.abn}
                  onChange={(e) => handleChange('abn', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                    formErrors.abn ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="XX XXX XXX XXX"
                />
                {formErrors.abn && <p className="text-red-600 text-sm mt-1">{formErrors.abn}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Structure *</label>
                <select
                  value={businessStructure}
                  onChange={(e) => setBusinessStructure(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent"
                >
                  <option value="Sole Trader">Sole Trader</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Private Company">Private Company</option>
                  <option value="Public Company">Public Company</option>
                  <option value="Trust">Trust</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ACN</label>
                <input
                  type="text"
                  value={form.acn}
                  onChange={(e) => handleChange('acn', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                    formErrors.acn ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="XXX XXX XXX"
                />
                {formErrors.acn && <p className="text-red-600 text-sm mt-1">{formErrors.acn}</p>}
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Registered Office Address *</label>
                <input
                  type="text"
                  value={form.registeredAddress}
                  onChange={(e) => handleChange('registeredAddress', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                    formErrors.registeredAddress ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.registeredAddress && <p className="text-red-600 text-sm mt-1">{formErrors.registeredAddress}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nature of Business / Main Income-producing Activity *</label>
                <input
                  type="text"
                  value={form.businessNature}
                  onChange={(e) => handleChange('businessNature', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                    formErrors.businessNature ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.businessNature && <p className="text-red-600 text-sm mt-1">{formErrors.businessNature}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry Type *</label>
                <select
                  value={industryType}
                  onChange={(e) => {
                    setIndustryType(e.target.value);
                    setFormErrors((prev) => {
                      const next = { ...prev, industryType: '' };
                      setSubmitError(formatSubmitErrors(next, directorErrors, tradeReferenceErrors));
                      return next;
                    });
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                    formErrors.industryType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select an industry type</option>
                  {[
                    'Ecommerce',
                    'Retail',
                    'Construction',
                    'Manufacturing',
                    'Wholesale',
                    'Service Business',
                    'Transport and Logistics',
                    'Healthcare',
                    'Agriculture',
                    'Hospitality',
                    'Mining',
                    'Automotive',
                    'Other',
                  ].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {formErrors.industryType && <p className="text-red-600 text-sm mt-1">{formErrors.industryType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year of Inception *</label>
                <input
                  type="text"
                  value={form.inceptionYear}
                  onChange={(e) => handleChange('inceptionYear', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                    formErrors.inceptionYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="YYYY"
                />
                {formErrors.inceptionYear && <p className="text-red-600 text-sm mt-1">{formErrors.inceptionYear}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Employees *</label>
                <input
                  type="number"
                  value={form.employees}
                  onChange={(e) => handleChange('employees', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                    formErrors.employees ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="0"
                />
                {formErrors.employees && <p className="text-red-600 text-sm mt-1">{formErrors.employees}</p>}
              </div>
            </div>
          </div>

          {/* Names */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Names</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Legal Entity Name *</label>
                <input
                  type="text"
                  value={form.legalName}
                  onChange={(e) => handleChange('legalName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                    formErrors.legalName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.legalName && <p className="text-red-600 text-sm mt-1">{formErrors.legalName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Trading Name *</label>
                <input
                  type="text"
                  value={form.tradingName}
                  onChange={(e) => handleChange('tradingName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                    formErrors.tradingName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.tradingName && <p className="text-red-600 text-sm mt-1">{formErrors.tradingName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Other Trading Names</label>
                <input
                  type="text"
                  value={form.otherNames}
                  onChange={(e) => handleChange('otherNames', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Trading Terms *</label>
                <select
                  value={accountTerms}
                  onChange={(e) => setAccountTerms(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent"
                >
                  <option value="7_days">7 Days</option>
                  <option value="14_days">14 Days</option>
                  <option value="30_days">30 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Credit Limit Requested *</label>
                <input
                  type="text"
                  value={form.creditLimit}
                  onChange={(e) => handleChange('creditLimit', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                    formErrors.creditLimit ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.creditLimit && <p className="text-red-600 text-sm mt-1">{formErrors.creditLimit}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Weekly Trade Amount *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <input
                    type="text"
                    value={form.weeklyTrade}
                    onChange={(e) => handleChange('weeklyTrade', e.target.value)}
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                      formErrors.weeklyTrade ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.weeklyTrade && <p className="text-red-600 text-sm mt-1">{formErrors.weeklyTrade}</p>}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { key: 'contactName', label: 'Primary Contact Name' },
                { key: 'contactEmail', label: 'Contact Email', type: 'email' },
                { key: 'contactPhone', label: 'Contact Phone' },
                { key: 'accountsName', label: 'Accounts Payable Name' },
                { key: 'accountsEmail', label: 'Accounts Email', type: 'email' },
                { key: 'accountsPhone', label: 'Accounts Phone' },
              ].map(({ key, label, type = 'text' }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label} *</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                      formErrors[key] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors[key] && <p className="text-red-600 text-sm mt-1">{formErrors[key]}</p>}
                </div>
              ))}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoices Sent via Email *</label>
                <input
                  type="email"
                  value={form.invoiceEmail}
                  onChange={(e) => handleChange('invoiceEmail', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                    formErrors.invoiceEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.invoiceEmail && <p className="text-red-600 text-sm mt-1">{formErrors.invoiceEmail}</p>}
              </div>
            </div>
          </div>

          {/* Business Address */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Business Address</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trading Street Address</label>
                  <input
                    type="text"
                    value={form.tradingStreetAddress}
                    onChange={(e) => handleChange('tradingStreetAddress', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post Code</label>
                  <input
                    type="text"
                    value={form.tradingPostCode}
                    onChange={(e) => handleChange('tradingPostCode', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Address of Business</label>
                  <input
                    type="text"
                    value={form.postalAddress}
                    onChange={(e) => handleChange('postalAddress', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post Code</label>
                  <input
                    type="text"
                    value={form.postalPostCode}
                    onChange={(e) => handleChange('postalPostCode', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Directors / Principals Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Directors / Principals Details
            </h2>
            {directors.map((director, idx) => {
              const directorError = directorErrors[idx] ?? createEmptyDirectorErrors();
              return (
                <div key={idx} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={director.name}
                        onChange={(e) => handleDirectorChange(idx, 'name', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                          directorError.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {directorError.name && <p className="text-red-600 text-sm mt-1">{directorError.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">DOB</label>
                      <input
                        type="date"
                        value={director.dob}
                        onChange={(e) => handleDirectorChange(idx, 'dob', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                          directorError.dob ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {directorError.dob && <p className="text-red-600 text-sm mt-1">{directorError.dob}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Driver's Licence No</label>
                      <input
                        type="text"
                        value={director.drivers_licence_no}
                        onChange={(e) => handleDirectorChange(idx, 'drivers_licence_no', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                          directorError.drivers_licence_no ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {directorError.drivers_licence_no && <p className="text-red-600 text-sm mt-1">{directorError.drivers_licence_no}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <div className="flex gap-2">
                        <select
                          value={director.state}
                          onChange={(e) => handleDirectorChange(idx, 'state', e.target.value)}
                          className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                            directorError.state ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          {['QLD', 'NSW', 'VIC', 'SA', 'WA', 'NT', 'TAS', 'ACT'].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {directors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDirector(idx)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-300"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                      {directorError.state && <p className="text-red-600 text-sm mt-1">{directorError.state}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="text"
                        value={director.phone}
                        onChange={(e) => handleDirectorChange(idx, 'phone', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                          directorError.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {directorError.phone && <p className="text-red-600 text-sm mt-1">{directorError.phone}</p>}
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Home Address</label>
                      <input
                        type="text"
                        value={director.address}
                        onChange={(e) => handleDirectorChange(idx, 'address', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                          directorError.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {directorError.address && <p className="text-red-600 text-sm mt-1">{directorError.address}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addDirector}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              + Add Another Director/Principal
            </button>
          </div>

          {/* Trade References */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Trade References
            </h2>
            {tradeReferences.map((reference, idx) => {
              const referenceError = tradeReferenceErrors[idx] ?? createEmptyTradeReferenceErrors();
              return (
                <div key={idx} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade Reference {idx + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={reference.fullName}
                        onChange={(e) => handleTradeReferenceChange(idx, 'fullName', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                          referenceError.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {referenceError.fullName && <p className="text-red-600 text-sm mt-1">{referenceError.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                      <input
                        type="text"
                        value={reference.companyName}
                        onChange={(e) => handleTradeReferenceChange(idx, 'companyName', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                          referenceError.companyName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {referenceError.companyName && <p className="text-red-600 text-sm mt-1">{referenceError.companyName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="text"
                        value={reference.phone}
                        onChange={(e) => handleTradeReferenceChange(idx, 'phone', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                          referenceError.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {referenceError.phone && <p className="text-red-600 text-sm mt-1">{referenceError.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={reference.email}
                        onChange={(e) => handleTradeReferenceChange(idx, 'email', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:border-transparent ${
                          referenceError.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {referenceError.email && <p className="text-red-600 text-sm mt-1">{referenceError.email}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Signature */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">Signature</h2>
            <div className="mb-4">
              <canvas
                ref={canvasRef}
                width={800}
                height={200}
                className="border-2 border-gray-300 rounded-lg cursor-crosshair w-full"
                style={{ maxWidth: '800px', height: '200px' }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseOut={stopDraw}
              />
            </div>
            <button
              type="button"
              onClick={clearSignature}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Signature
            </button>
            {formErrors.signature && <p className="text-red-600 text-sm mt-2">{formErrors.signature}</p>}
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg">
              <p className="text-sm">{submitError}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={submitting}
              className="px-12 py-3 bg-gradient-to-br from-[#132B43] to-[#1a3a52] text-white font-semibold text-lg rounded-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
            <p className="text-sm text-gray-600 mt-4">
              * Required fields. Your information will be kept confidential.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
