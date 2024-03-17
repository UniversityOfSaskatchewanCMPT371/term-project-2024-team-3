import React from "react";
import { HashLoader } from "react-spinners";
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
    loading: boolean;
}

function LoadingSpinner({ loading }: LoadingSpinnerProps): React.ReactElement {
    return (
        <div className="spinner">
            <HashLoader color="#017176" loading={loading} size={100} />
        </div>
    );
}

export default LoadingSpinner;
