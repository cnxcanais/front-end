"use client"

import { Permission } from "@/@types/permissions"
import { CaretDown, CaretUp } from "@phosphor-icons/react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

type PermissionCardProps = {
  name: string
  componentAccess?: string
  length: number
  type: string
  associatedURL?: string
  childCardsName?: string
  cardsDisplay?: CardDisplay
  setCardsDisplay?: Dispatch<SetStateAction<CardDisplay>>
  setUpdatedPermissions: Dispatch<SetStateAction<Permission.Type | undefined>>
  updatedPermissions: Permission.Type | undefined
}

type CardDisplay = Record<string, boolean>

export const PermissionCard = ({
  name,
  type,
  length,
  setCardsDisplay,
  cardsDisplay,
  childCardsName,
  setUpdatedPermissions,
  updatedPermissions,
  componentAccess,
  associatedURL,
}: PermissionCardProps) => {
  const [isAccessClicked, setIsAccessClicked] = useState(false)
  const [isCardActive, setIsCardActive] = useState(false)

  useEffect(() => {
    if (updatedPermissions) {
      if (componentAccess) {
        setIsAccessClicked(updatedPermissions.componentAccess[componentAccess])
      } else {
        setIsAccessClicked(updatedPermissions.urlAccess[associatedURL])
      }
    }
  }, [updatedPermissions, componentAccess, associatedURL])

  const handleClick = () => {
    if (setCardsDisplay && cardsDisplay && childCardsName) {
      setCardsDisplay((prevState: any) => ({
        ...prevState,
        [childCardsName]: !prevState[childCardsName],
      }))
      setIsCardActive(!isCardActive)
    } else {
      return
    }
  }

  const handleAccessClick = () => {
    const newCheckedState = !isAccessClicked
    setIsAccessClicked(newCheckedState)

    if (updatedPermissions && setUpdatedPermissions) {
      if (componentAccess) {
        const updatedComponentAccess = {
          ...updatedPermissions.componentAccess,
          [componentAccess]: newCheckedState,
        }

        setUpdatedPermissions({
          ...updatedPermissions,
          componentAccess: updatedComponentAccess,
        })
      }

      if (associatedURL) {
        const updatedAllowedURL = {
          ...updatedPermissions?.urlAccess,
          [associatedURL]: newCheckedState,
        }
        setUpdatedPermissions((prev) => ({
          ...prev,
          urlAccess: updatedAllowedURL,
        }))
      }
    }
  }

  const defineLength = () => {
    switch (length) {
      case 10:
        return "w-full"
      case 9:
        return "w-[95%]"
      case 8:
        return "w-[90%]"
      case 7:
        return "w-[85%]"
      case 6:
        return "w-[80%]"
      case 5:
        return "w-[75%]"
      case 4:
        return "w-[70%]"
      case 3:
        return "w-[65%]"
      case 2:
        return "w-[60%]"
      case 1:
        return "w-[55%]"
    }
  }

  const lengthClass = defineLength()

  return (
    <div
      className={`flex items-center justify-between ${lengthClass} mt-3 rounded-md border-2 border-yellow-200 ${length === 10 ? "bg-yellow-100" : "bg-blue-100"} p-2 text-blue-400`}>
      <h2>{name}</h2>
      <div className="m-0 flex items-center gap-4 p-0">
        <p>{type}</p>
        <input
          type="checkbox"
          name="componentAccess"
          checked={isAccessClicked}
          onChange={handleAccessClick}
        />
        {childCardsName ?
          isCardActive ?
            <CaretUp size={30} onClick={handleClick} />
          : <CaretDown size={30} onClick={handleClick} />
        : <p style={{ width: "30px" }}></p>}
      </div>
    </div>
  )
}
