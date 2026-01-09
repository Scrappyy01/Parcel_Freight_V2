'use client';

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({
  isOpen = false,
  onClose,
  title = '',
  children,
  footer = null,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = '',
}) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      handleClose();
    }
  };

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[9999]"
        onClose={closeOnBackdropClick ? handleClose : () => {}}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white bg-opacity-50" onClick={handleBackdropClick} />
        </Transition.Child>

        {/* Modal container */}
<div className="fixed inset-0 flex min-h-full w-full">
  {/* Lado esquerdo: imagem */}
  <div
    className="hidden md:block md:w-2/2 bg-cover"
    style={{ backgroundImage: "url('/images/loadlink-freight-intelligence.jpg')", backgroundPosition: '55% center' }}
  />

  {/* Lado direito: modal na parte branca */}
  <div className="w-full md:w-1/2 flex items-center justify-center p-4 text-center bg-white">
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >

              <Dialog.Panel
                className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all ${className}`}
              >
                {/* Header */}
               {/* Header */}
{(title || showCloseButton) && (
  <div className="relative border-b border-gray-200 px-6 py-4">
    {title && (
      <Dialog.Title
        as="h3"
        className="text-lg font-semibold leading-6 text-gray-900"
      >
        {title}
      </Dialog.Title>
    )}
    {showCloseButton && (
<button
  type="button"
  className="absolute top-2 right-4 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  onClick={handleClose}
>
  <span className="sr-only">Close</span>
  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
</button>
    )}
  </div>
)}

                {/* Body */}
                <div className="px-6 py-4">
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'full']),
  showCloseButton: PropTypes.bool,
  closeOnBackdropClick: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;