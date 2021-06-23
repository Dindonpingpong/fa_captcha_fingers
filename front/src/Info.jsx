import React, { useEffect, useState } from "react";
import { Alert } from "reactstrap";

const Info = ({ message, setMsg }) => {
    const [isVisible, setClose] = useState(true);

    useEffect(() => {
        if (isVisible) {
            window.setTimeout(() => {
                setClose(!isVisible);
                setMsg(null);
            }, 3000);
        }
    }, [isVisible]);

    return (
        <Alert isOpen={isVisible} color="danger">{message}</Alert>
    );
}

export default Info;