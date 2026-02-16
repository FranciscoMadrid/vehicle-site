import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import type { Toast } from 'primereact/toast';
import React, { useState, type CSSProperties } from 'react'

export interface DialogButtonProps {
  label?: string,
  header?:string,
  severity?: "success" | "info" | "warning" | "danger" | "contrast" | "secondary",
  className?: string,
  children: (handleClose: () => void) => React.ReactNode;
  disabled?: boolean
}

export default function DialogButton({
  label,
  header,
  severity = "info",
  className,
  children,
  disabled = false,
}:DialogButtonProps) {
  const [visible, setVisible] = useState(false)

  const handleToggle = () => {
    setVisible(!visible);
  }
  const handleClose = () => {
    setVisible(false)
  }

  return (
    <>
      <Button 
        label={label} 
        disabled={disabled}
        outlined={disabled}
        severity={severity}
        onClick={handleToggle}/>
      <Dialog
        draggable={false}
        header={header}
        visible={visible}
        onHide={handleClose}
        className={className}
      >
        {children(handleClose)}
      </Dialog>
    </>
  )
}
