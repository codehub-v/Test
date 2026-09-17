import React, { useEffect, useState } from "react";

import {
    getSeasons,
    createSeason,
    updateSeason,
} from "../../../apis/masterApi";

import MasterList from "../../../components/MasterList";
import MasterModal from "../../../components/MasterModal";

const SeasonList = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingSeason, setEditingSeason] = useState(null);

    const fetchSeasons = async () => {
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

            const response = await getSeasons(params);

            setData(response.data.results || []);

            setTotalPages(
                Math.ceil((response.data.count || 0) / 10)
            );
        } catch (error) {
            console.error("Error fetching seasons:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeasons();
    }, [currentPage, search, status]);

    const handleAdd = () => {
        setEditingSeason(null);
        setShowModal(true);
    };

    const handleEdit = (season) => {
        setEditingSeason(season);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingSeason(null);
    };

    return (
        <>
            <MasterList
                title="Seasons"
                subtitle="Manage season master data"
                searchPlaceholder="Search seasons..."
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
                        label: "Season",
                    },
                ]}
                onAdd={handleAdd}
                onEdit={handleEdit}
            />

            <MasterModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSuccess={fetchSeasons}
                title="Season"
                identityLabel="Season Name"
                identityPlaceholder="Enter season name"
                codeLabel="Season Code"
                codePlaceholder="Enter season code"
                editingItem={editingSeason}
                create={createSeason}
                update={updateSeason}
            />
        </>
    );
};

export default SeasonList;