
import api from '../lib/axios';
import { ContactUscreate, ContactUsResponse } from '../types/contact_us';

export const createContactUs = async (
  payload: ContactUscreate
): Promise<ContactUsResponse> => {
  try {
    const response = await api.post("/contactus/createContactUs", payload);
    console.log("res", response.data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getAllContactUs = async (): Promise<ContactUsResponse> => {
  const response = await api.get("/contactus/getAllContactUs");
  console.log("source of finance response",response);

  return response?.data;
};

export const updateContactUsById = async (id: number, data: ContactUscreate): Promise<ContactUsResponse> => {
  try {
    console.log("");
    const { office_name, location,address,postal_code,tel,fax,email_primary } = data;
    const payload = {
     office_name, 
     location,
     address,
     postal_code,
     tel,
     fax,
     email_primary
    };
    const res = await api.put(`/contactus/updateContactUsById/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Update failed:", err.response?.data || err.message);
    throw err;
  }
};


export const deleteContactUsById = async (id: number): Promise<void> => {
  await api.delete(`/contactus/deleteContactUsById/${id}`);
};
