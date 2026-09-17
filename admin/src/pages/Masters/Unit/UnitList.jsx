import React, { useEffect, useState } from "react";

import {
    getUnits,
    createUnit,
    updateUnit,
} from "../../../apis/masterApi";

import MasterList from "../../../components/MasterList";
import MasterModal from "../../../components/MasterModal";

const UnitList = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);

    const fetchUnits = async () => {
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

            const response = await getUnits(params);

            setData(response.data.results || []);

            setTotalPages(
                Math.ceil((response.data.count || 0) / 10)
            );
        } catch (error) {
            console.error("Error fetching units:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, [currentPage, search, status]);

    const handleAdd = () => {
        setEditingUnit(null);
        setShowModal(true);
    };

    const handleEdit = (unit) => {
        setEditingUnit(unit);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUnit(null);
    };

    return (
        <>
            <MasterList
                title="Units"
                subtitle="Manage unit master data"
                searchPlaceholder="Search units..."
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
                        label: "Unit",
                    },
                ]}
                onAdd={handleAdd}
                onEdit={handleEdit}
            />

            <MasterModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSuccess={fetchUnits}
                title="Unit"
                identityLabel="Unit Name"
                identityPlaceholder="Enter unit name"
                codeLabel="Unit Code"
                codePlaceholder="Enter unit code"
                editingItem={editingUnit}
                create={createUnit}
                update={updateUnit}
            />
        </>
    );
};

export default UnitList;