// Action to add colleges
export const add_colleges_Action = (data) => ({
    type: 'Add_Colleges',
    payload: { 
      data: data // This can be a single college or an array of colleges
    }
  });
  
  // Action to remove a college by its ID
  export const remove_colleges_Action = (id) => ({
    type: 'Remove_Colleges',
    payload: { 
      id: id // Pass the ID of the college to remove
    }
  });
  
  // Action to update the status of a college by its ID
  export const update_status_Action = (id, status) => ({
    type: 'Update_Status',
    payload: { 
      id: id,      // The ID of the college whose status needs updating
      status: status // The new status value
    }
  });
  