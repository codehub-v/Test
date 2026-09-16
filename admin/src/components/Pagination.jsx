
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const goToPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div style={styles.container}>
            <button
                onClick={goToPrevious}
                disabled={currentPage === 1}
                style={{
                    ...styles.button,
                    ...(currentPage === 1 ? styles.disabled : {}),
                }}
            >
                <ChevronLeft size={18} />
            </button>

            <span style={styles.pageInfo}>
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                style={{
                    ...styles.button,
                    ...(currentPage === totalPages ? styles.disabled : {}),
                }}
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "16px",
    },

    button: {
        width: "36px",
        height: "36px",
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    },

    disabled: {
        opacity: 0.5,
        cursor: "not-allowed",
    },

    pageInfo: {
        fontSize: "14px",
        color: "#475569",
    },
};

export default Pagination;

