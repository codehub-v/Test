import React, { useEffect, useState } from "react";
import { X, Database, Check } from "lucide-react";

import "./MasterModal.css";


const MasterModal = ({
    isOpen,
    onClose,
    onSuccess,

    title = "Master",
    subtitle,

    editingItem,

    create,
    update,

    identityLabel = "Name",
    identityPlaceholder = "Enter name",

    codeLabel = "Code",
    codePlaceholder = "Enter code",

    showCode = true,

    identityRequiredMessage,
    codeRequiredMessage,
}) => {

    const [formData, setFormData] = useState({
        identity: "",
        code: "",
        is_active: true,
    });

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        identity: "",
        code: "",
    });

    const [serverError, setServerError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");


    /* ================= INITIALIZE ================= */

    useEffect(() => {

        if (editingItem) {

            setFormData({
                identity:
                    editingItem.identity || "",

                code:
                    editingItem.code || "",

                is_active:
                    editingItem.is_active ?? true,
            });

        } else {

            setFormData({
                identity: "",
                code: "",
                is_active: true,
            });

        }

        setErrors({
            identity: "",
            code: "",
        });

        setServerError("");
        setSuccessMessage("");

    }, [editingItem, isOpen]);


    if (!isOpen) {
        return null;
    }


    /* ================= CHANGE ================= */

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;


        setFormData((prev) => ({
            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));


        if (
            name === "identity" ||
            name === "code"
        ) {

            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));

        }

        setServerError("");
    };


    /* ================= SUBMIT ================= */

    const handleSubmit = async (e) => {

        e.preventDefault();


        setErrors({
            identity: "",
            code: "",
        });

        setServerError("");
        setSuccessMessage("");


        /* ================= VALIDATION ================= */

        const newErrors = {
            identity: "",
            code: "",
        };


        if (!formData.identity.trim()) {

            newErrors.identity =
                identityRequiredMessage ||
                `Please enter a ${identityLabel.toLowerCase()}.`;
        }


        if (
            showCode &&
            !formData.code.trim()
        ) {

            newErrors.code =
                codeRequiredMessage ||
                `Please enter a ${codeLabel.toLowerCase()}.`;
        }


        if (
            newErrors.identity ||
            newErrors.code
        ) {

            setErrors(newErrors);

            return;
        }


        setLoading(true);


        try {

            const payload = {
                ...formData,

                identity:
                    formData.identity.trim(),

                ...(showCode && {
                    code:
                        formData.code.trim(),
                }),
            };


            let response;


            /* ================= UPDATE ================= */

            if (editingItem) {

                response = await update(
                    editingItem.id,
                    payload
                );

            }


            /* ================= CREATE ================= */

            else {

                response = await create(
                    payload
                );

            }


            console.log(
                "SUCCESS RESPONSE:",
                response
            );


            /* ================= REFRESH ================= */

            if (onSuccess) {
                await onSuccess();
            }


            /* ================= SUCCESS ================= */

            setSuccessMessage(
                response?.data?.message ||
                (
                    editingItem
                        ? `${title} updated successfully.`
                        : `${title} created successfully.`
                )
            );


            setTimeout(() => {
                onClose();
            }, 1000);


        } catch (error) {

            console.log(
                "API ERROR:",
                error
            );


            const data =
                error?.response?.data ||
                error;


            console.log(
                "API ERROR DATA:",
                data
            );


            /* ================= DUPLICATE ================= */

            if (
                data?.code ===
                "DUPLICATE_ENTRY"
            ) {

                if (
                    data.field ===
                    "identity"
                ) {

                    setErrors((prev) => ({
                        ...prev,

                        identity:
                            data.error ||
                            `${title} name already exists.`,
                    }));

                }


                if (
                    data.field ===
                    "code"
                ) {

                    setErrors((prev) => ({
                        ...prev,

                        code:
                            data.error ||
                            `${title} code already exists.`,
                    }));

                }

                return;
            }


            /* ================= FIELD ERRORS ================= */

            if (data?.identity) {

                setErrors((prev) => ({
                    ...prev,

                    identity:
                        Array.isArray(
                            data.identity
                        )
                            ? data.identity[0]
                            : data.identity,
                }));

            }


            if (data?.code) {

                setErrors((prev) => ({
                    ...prev,

                    code:
                        Array.isArray(
                            data.code
                        )
                            ? data.code[0]
                            : data.code,
                }));

            }


            /* ================= GENERAL ERROR ================= */

            if (
                data?.error &&
                !data?.identity &&
                !data?.code
            ) {

                setServerError(
                    data.error
                );

            } else if (
                data?.detail &&
                !data?.identity &&
                !data?.code
            ) {

                setServerError(
                    data.detail
                );

            } else if (
                data?.message &&
                !data?.identity &&
                !data?.code
            ) {

                setServerError(
                    data.message
                );

            } else if (
                !data?.identity &&
                !data?.code &&
                !data?.error &&
                !data?.detail &&
                !data?.message
            ) {

                setServerError(
                    "Something went wrong. Please try again."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="master-modal-overlay">

            <div className="master-modal">

                {/* ================= HEADER ================= */}

                <div className="master-modal-header">

                    <div className="master-modal-header-left">

                        <div className="master-modal-icon">

                            <Database size={21} />

                        </div>


                        <div>

                            <h2 className="master-modal-title">

                                {editingItem
                                    ? `Edit ${title}`
                                    : `Add ${title}`}

                            </h2>


                            <p className="master-modal-subtitle">

                                {subtitle ||
                                    (
                                        editingItem
                                            ? `Update the ${title.toLowerCase()} master details`
                                            : `Create a new ${title.toLowerCase()} in the master`
                                    )}

                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="master-modal-close"
                        disabled={loading}
                    >

                        <X size={19} />

                    </button>

                </div>


                {/* ================= FORM ================= */}

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="master-modal-form">


                        {/* SUCCESS */}

                        {successMessage && (

                            <div className="master-success-message">

                                {successMessage}

                            </div>

                        )}


                        {/* SERVER ERROR */}

                        {serverError && (

                            <div className="master-server-error">

                                {serverError}

                            </div>

                        )}


                        {/* ================= IDENTITY ================= */}

                        <div className="master-form-group">

                            <label className="master-label">

                                {identityLabel}

                                <span className="master-required">
                                    *
                                </span>

                            </label>


                            <input
                                type="text"
                                name="identity"
                                value={
                                    formData.identity
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder={
                                    identityPlaceholder
                                }
                                disabled={
                                    loading
                                }
                                className={
                                    errors.identity
                                        ? "master-input master-input-error"
                                        : "master-input"
                                }
                            />


                            {errors.identity && (

                                <div className="master-field-error">

                                    {errors.identity}

                                </div>

                            )}

                        </div>


                        {/* ================= CODE ================= */}

                        {showCode && (

                            <div className="master-form-group">

                                <label className="master-label">

                                    {codeLabel}

                                    <span className="master-required">
                                        *
                                    </span>

                                </label>


                                <input
                                    type="text"
                                    name="code"
                                    value={
                                        formData.code
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder={
                                        codePlaceholder
                                    }
                                    disabled={
                                        loading
                                    }
                                    className={
                                        errors.code
                                            ? "master-input master-input-error"
                                            : "master-input"
                                    }
                                />


                                {errors.code && (

                                    <div className="master-field-error">

                                        {errors.code}

                                    </div>

                                )}

                            </div>

                        )}


                        {/* ================= STATUS ================= */}

                        <div className="master-status-box">

                            <div>

                                <div className="master-status-title">
                                    Status
                                </div>

                                <div className="master-status-description">

                                    {formData.is_active
                                        ? `This ${title.toLowerCase()} is currently active`
                                        : `This ${title.toLowerCase()} is currently inactive`}

                                </div>

                            </div>


                            <label className="master-toggle">

                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={
                                        formData.is_active
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="master-hidden-checkbox"
                                    disabled={
                                        loading
                                    }
                                />


                                <span
                                    className={
                                        formData.is_active
                                            ? "master-slider master-slider-active"
                                            : "master-slider"
                                    }
                                >

                                    <span
                                        className={
                                            formData.is_active
                                                ? "master-slider-circle master-slider-circle-active"
                                                : "master-slider-circle"
                                        }
                                    >

                                        {formData.is_active && (
                                            <Check
                                                size={11}
                                                color="#4f46e5"
                                            />
                                        )}

                                    </span>

                                </span>

                            </label>

                        </div>

                    </div>


                    {/* ================= FOOTER ================= */}

                    <div className="master-modal-footer">

                        <button
                            type="button"
                            onClick={onClose}
                            className="master-cancel-button"
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={loading}
                            className="master-submit-button"
                        >

                            {loading
                                ? "Saving..."
                                : editingItem
                                    ? `Update ${title}`
                                    : `Create ${title}`}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};


export default MasterModal;