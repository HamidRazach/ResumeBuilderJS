import { toast } from 'react-toastify';

export const errorMessage = (msg) => {
  toast.error(msg, {
    position: "top-center",
    closeOnClick: true,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable:true,
    autoClose:1000
  });
};

export const successMessage = (msg) => {
  toast.success(msg, {
    // position: "top-center",
    position: "top-center",
    closeOnClick: true,
    hideProgressBar: false,
    pauseOnHover: true,
    draggable:true,
    autoClose:1000
  });
};
