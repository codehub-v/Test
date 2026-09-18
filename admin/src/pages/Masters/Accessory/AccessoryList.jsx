import React, { useEffect, useState } from "react";

import {
    getAccessory,
    createAccessory,
    updateAccessory,
} from "../../../apis/masterApi";

import MasterList from "../../../components/MasterList";
import MasterModal from "../../../components/MasterModal";

const AccessoryList = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingAccessory, setEditingAccessory] = useState(null);

    const fetchAccessories = async () => {
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

            const response = await getAccessory(params);

            setData(response.data.results || []);

            setTotalPages(
                Math.ceil((response.data.count || 0) / 10)
            );

        } catch (error) {
            console.error(
                "Error fetching accessories:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccessories();
    }, [currentPage, search, status]);

    const handleAdd = () => {
        setEditingAccessory(null);
        setShowModal(true);
    };

    const handleEdit = (accessory) => {
        setEditingAccessory(accessory);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingAccessory(null);
    };

    return (
        <>
            <MasterList
                title="Accessories"
                subtitle="Manage accessory master data"
                searchPlaceholder="Search accessories..."
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
                        label: "Accessory",
                    },
                ]}
                onAdd={handleAdd}
                onEdit={handleEdit}
            />

            <MasterModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSuccess={fetchAccessories}
                title="Accessory"
                identityLabel="Accessory Name"
                identityPlaceholder="Enter accessory name"
                codeLabel="Accessory Code"
                codePlaceholder="Enter accessory code"
                editingItem={editingAccessory}
                create={createAccessory}
                update={updateAccessory}
            />
        </>
    );
};

export default AccessoryList;