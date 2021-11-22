import React from 'react'

interface COMPONENT_NAMEProps{

}

const CSS_HANDLES = [
    "COMPONENT_NAMEContainer"
]

const COMPONENT_NAME = ({

}: COMPONENT_NAMEProps) => {

    //@ts-expect-error not defined
    const { handles } = useCSSHandles(CSS_HANDLES);

    return (
        <div className={handles.COMPONENT_NAMEContainer}>
        </div>
    )
}

export default COMPONENT_NAME;