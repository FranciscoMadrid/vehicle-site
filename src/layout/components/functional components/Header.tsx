import React, { useEffect, useRef, useState } from 'react'
import { Avatar } from 'primereact/avatar';
import { OverlayPanel } from 'primereact/overlaypanel'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

export interface HeaderProps {
  title: string,
  avatar_user?: string,
  avatar_picture?: string
}
export default function Header({title, avatar_user ='FFMS', avatar_picture}: HeaderProps) {
  const [currentUserName, setCurrentUserName] = useState(avatar_user);
  const [tempName, setTempName] = useState(currentUserName)
  const [visible, setVisible] = useState(false);
  const op = useRef<OverlayPanel>(null);

  /* Helps with the window resize, otherwise the menu would remain past the container on resize */
  useEffect(() => {
    const hide = () => op.current?.hide()

    window.addEventListener('resize', hide)
    window.addEventListener('pointerdown', hide)

    return () => {
      window.removeEventListener('resize', hide)
      window.removeEventListener('pointerdown', hide)
    }
  }, [])

    const openDialog = () => {
    setTempName(currentUserName)
    setVisible(true)
    op.current?.hide()
  }

  const saveName = () => {
    if (tempName.trim()) {
      setCurrentUserName(tempName.trim())
      setVisible(false)
    }
  }

  return (
    <header className='w-full h-fit p-5 bg-light flex flex-row items-center justify-between'>
      <h1 className='text-2xl font-bold tracking-wide'>{title}</h1>
      <Avatar 
        label={currentUserName.charAt(0)}
        shape='circle'
        onClick={(e) => op.current?.toggle(e)}
        aria-controls="popup_menu_user"
        aria-haspopup
        size='large'/>
      <OverlayPanel ref={op} dismissable>
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-500">
            Logged as: {currentUserName}
          </span>

          <button
            onClick={openDialog}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100"
          >
            <i className="pi pi-pencil" />
            Change User
          </button>
        </div>
      </OverlayPanel>
      <Dialog 
        header="Change your name"
        visible={visible} 
        onHide={() => setVisible(false)}>
        <div className="flex flex-col gap-4">
          <InputText
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Enter new name"
            autoFocus
          />

          <div className="flex justify-end gap-2">
            <Button
              label="Cancel"
              severity="secondary"
              onClick={() => setVisible(false)}
            />
            <Button label="Save" onClick={saveName} />
          </div>
        </div>
      </Dialog>
    </header>
  )
}
