import React, { useEffect, useState } from "react";

import {
    getStyles,
    createStyle,
    updateStyle,
} from "../../../apis/masterApi";

import MasterList from "../../../components/MasterList";
import MasterModal from "../../../components/MasterModal";

const StyleList = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingStyle, setEditingStyle] = useState(null);

    const fetchStyles = async () => {
        try {
            setLoading(true);

            const params = {
                page: currentPage,
            };

            if (search) {
                params.search = search;
            }

            if (status) {
                params.is_active = status;
            }

            const response = await getStyles(params);

            setData(response.data.results || []);

            setTotalPages(
                Math.ceil((response.data.count || 0) / 10)
            );
        } catch (error) {
            console.error("Error fetching styles:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStyles();
    }, [currentPage, search, status]);

    const handleAdd = () => {
        setEditingStyle(null);
        setShowModal(true);
    };

    const handleEdit = (style) => {
        setEditingStyle(style);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingStyle(null);
    };

    return (
        <>
            <MasterList
                title="Styles"
                subtitle="Manage style master data"
                searchPlaceholder="Search styles..."
                data={data}
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                loading={loading}
                columns={[
                    {
                        key: "code",
                        label: "Code",
                    },
                    {
                        key: "identity",
                        label: "Style",
                    },
                ]}
                onAdd={handleAdd}
                onEdit={handleEdit}
            />

            <MasterModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSuccess={fetchStyles}
                title="Style"
                identityLabel="Style Name"
                identityPlaceholder="Enter style name"
                codeLabel="Style Code"
                codePlaceholder="Enter style code"
                editingItem={editingStyle}
                create={createStyle}
                update={updateStyle}
            />
        </>
    );
};

export default StyleList;