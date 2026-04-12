import api from "./axios"

export const equipmentAPI = {
  getCatalogModels: () => api.get("/equipment-models"),
  getCatalogItems: () => api.get("/equipment-models/catalog-items"),
  getCatalogItemDetail: (equipmentId) => api.get(`/equipment-models/catalog-items/${equipmentId}`),
  getCatalogModelById: (modelId) => api.get(`/equipment-models/${modelId}`),
  getAdminModels: () => api.get("/admin/equipment-models"),
  createModel: (data) => api.post("/admin/equipment-models", data),
  addItems: (modelId, data) => api.post(`/admin/equipment-models/${modelId}/items`, data),
  updateItemStatus: (equipmentId, status) =>
    api.patch(`/admin/equipment-models/items/${equipmentId}/status`, { status }),
  uploadModelImage: (modelId, file) => {
    const formData = new FormData()
    formData.append("file", file)
    return api.post(`/admin/equipment-models/${modelId}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
}