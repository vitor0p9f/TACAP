import React from "react";
import { Modal } from "../BaseModal";
import AssessmentForm from "../../forms/assessment";

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function AssessmentModal({
  isOpen,
  onClose,
  onSubmit,
}: AssessmentModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Teste de aptidão física" size="large">
      <AssessmentForm onSubmit={onSubmit} />
    </Modal>
  );
}
