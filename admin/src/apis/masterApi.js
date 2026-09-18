import api from "./base";

// Color APIs
export const getColors = (params = {}) => {
    return api.get("/master/colors/", {params});
};

export const createColor = (data) => {
    return api.post("/master/colors/", data);
};

export const updateColor = (id, data) => {
    return api.put(`/master/colors/${id}/`, data);
};

export const patchColor = (id, data) => {
    return api.patch(`/master/colors/${id}/`, data);
};

export const deleteColor = (id) => {
    return api.delete(`/master/colors/${id}/`);
};


// Customer APIs
export const getCustomers = (params = {}) => {
    return api.get("/master/customers/", {params});
};

export const createCustomer = (data) => {
    return api.post("/master/customers/", data);
};

export const updateCustomer = (id, data) => {
    return api.put(`/master/customers/${id}/`, data);
};

export const patchCustomer = (id, data) => {
    return api.patch(`/master/customers/${id}/`, data);
};

export const deleteCustomer = (id) => {
    return api.delete(`/master/customers/${id}/`);
};


// Supplier APIs
export const getSuppliers = (params={}) => {
    return api.get("/master/suppliers/", {params});
};

export const createSupplier = (data) => {
    return api.post("/master/suppliers/", data);
};

export const updateSupplier = (id, data) => {
    return api.put(`/master/suppliers/${id}/`, data);
};

export const patchSupplier = (id, data) => {
    return api.patch(`/master/suppliers/${id}/`, data);
};

export const deleteSupplier = (id) => {
    return api.delete(`/master/suppliers/${id}/`);
};


// Style APIs
export const getStyles = (params={}) => {
    return api.get("/master/styles/", {params});
};

export const createStyle = (data) => {
    return api.post("/master/styles/", data);
};

export const updateStyle = (id, data) => {
    return api.put(`/master/styles/${id}/`, data);
};

export const patchStyle = (id, data) => {
    return api.patch(`/master/styles/${id}/`, data);
};

export const deleteStyle = (id) => {
    return api.delete(`/master/styles/${id}/`);
};


// Size APIs
export const getSizes = (params={}) => {
    return api.get("/master/sizes/", {params});
};

export const createSize = (data) => {
    return api.post("/master/sizes/", data);
};

export const updateSize = (id, data) => {
    return api.put(`/master/sizes/${id}/`, data);
};

export const patchSize = (id, data) => {
    return api.patch(`/master/sizes/${id}/`, data);
};

export const deleteSize = (id) => {
    return api.delete(`/master/sizes/${id}/`);
};


// Fabric APIs
export const getFabrics = (params={}) => {
    return api.get("/master/fabrics/", {params});
};

export const createFabric = (data) => {
    return api.post("/master/fabrics/", data);
};

export const updateFabric = (id, data) => {
    return api.put(`/master/fabrics/${id}/`, data);
};

export const patchFabric = (id, data) => {
    return api.patch(`/master/fabrics/${id}/`, data);
};

export const deleteFabric = (id) => {
    return api.delete(`/master/fabrics/${id}/`);
};


// Season APIs
export const getSeasons = (params={}) => {
    return api.get("/master/seasons/", {params});
};

export const createSeason = (data) => {
    return api.post("/master/seasons/", data);
};

export const updateSeason = (id, data) => {
    return api.put(`/master/seasons/${id}/`, data);
};

export const patchSeason = (id, data) => {
    return api.patch(`/master/seasons/${id}/`, data);
};

export const deleteSeason = (id) => {
    return api.delete(`/master/seasons/${id}/`);
};

// Unit APIs
export const getUnits = (params={}) => {
    return api.get("/master/units/", {params});
};

export const createUnit = (data) => {
    return api.post("/master/units/", data);
};

export const updateUnit = (id, data) => {
    return api.put(`/master/units/${id}/`, data);
};

export const patchUnit = (id, data) => {
    return api.patch(`/master/units/${id}/`, data);
};

export const deleteUnit = (id) => {
    return api.delete(`/master/units/${id}/`);
};

// Accessory APIs
export const getAccessory = (params={}) => {
    return api.get("/master/accessory/", {params});
};

export const createAccessory = (data) => {
    return api.post("/master/accessory/", data);
};

export const updateAccessory = (id, data) => {
    return api.put(`/master/accessory/${id}/`, data);
};

export const patchAccessory = (id, data) => {
    return api.patch(`/master/accessory/${id}/`, data);
};

export const deleteAccessory = (id) => {
    return api.delete(`/master/accessory/${id}/`);
};

// BOM APIs
export const getBOMs = (params = {}) => {
    return api.get("/master/bom/", {
        params,
    });
};