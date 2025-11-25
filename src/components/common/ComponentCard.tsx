"use client";
import React from "react";
import { Button } from "../ui/Button";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import AddUserModal from "../form/AddUserForm/AddUserModal";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  isButtonVisible?: boolean;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  isButtonVisible
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5">
        <div className="flex justify-between">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
          {isButtonVisible && (<Button onClick={openModal} className="dark:text-gray-400">
            <Plus className="h-4 w-4 mr-2 dark:text-gray-400" />
            Add Buyer
          </Button>)}

        </div>
        {desc && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </p>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
      {isOpen && (
        <AddUserModal isOpen={isOpen}
          closeModal={closeModal} role={'buyer'} />
      )}
    </div>
  );
};

export default ComponentCard;
