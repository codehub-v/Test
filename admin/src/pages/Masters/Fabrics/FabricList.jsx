import React, { useEffect, useState } from "react";

import {
    getFabrics,
    createFabric,
    updateFabric,
} from "../../../apis/masterApi";
import MasterList from "../../../components/MasterList";
import MasterModal from "../../../components/MasterModal";



const FabricList = () => {

    const [data, setData] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingFabric, setEditingFabric] = useState(null);



    const fetchFabrics = async () => {

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

            const response = await getFabrics(params);

            setData(
                response.data.results || []
            );

            setTotalPages(
                Math.ceil(
                    (response.data.count || 0) / 10
                )
            );

        } catch (error) {

            console.error(
                "Error fetching fabrics:",
                error
            );

        } finally {
            setLoading(false);
        }
    };


    /* ================= LOAD ================= */

    useEffect(() => {
        fetchFabrics();
    }, [
        currentPage,
        search,
        status,
    ]);


    /* ================= ADD ================= */

    const handleAdd = () => {

        setEditingFabric(null);

        setShowModal(true);
    };


    /* ================= EDIT ================= */

    const handleEdit = (fabric) => {

        setEditingFabric(fabric);

        setShowModal(true);
    };


    /* ================= CLOSE ================= */

    const handleCloseModal = () => {

        setShowModal(false);

        setEditingFabric(null);
    };


    return (
        <>
            <MasterList

                title="Fabric"

                subtitle="Manage fabric master data"

                searchPlaceholder="Search fabrics..."

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
                        label: "Fabric",
                    },
                ]}

                onAdd={handleAdd}

                onEdit={handleEdit}

            />


            <MasterModal

                isOpen={showModal}

                onClose={handleCloseModal}

                onSuccess={fetchFabrics}

                title="Fabric"

                fields={[
                    {
                        name: "identity",
                        label: "Fabric Name",
                        placeholder:
                            "Enter fabric name",
                        required: true,
                    },
                    {
                        name: "code",
                        label: "Fabric Code",
                        placeholder:
                            "Enter fabric code",
                        required: true,
                    },
                ]}

                editingItem={editingFabric}

                create={createFabric}

                update={updateFabric}

            />
        </>
    );
};


export default FabricList;