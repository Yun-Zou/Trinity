import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';

function OptionButton({value, onButtonClick}) {
    return (
        <Button
            className="ai-options py-2 shadow"
            variant="dark"
            size="sm"
            // disabled={isLoading}
            onClick={onButtonClick}
        >
            {value}
        </Button>
    );
}

export default OptionButton;