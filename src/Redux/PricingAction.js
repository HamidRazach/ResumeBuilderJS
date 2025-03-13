 
 
export const payment_status = (grade, id, price, type, package_id ) => ({
    type: 'PAYMENT_STATUS',
    payload: { 
        grade: grade,
        id: id,
        price: price,
        type: type,
        package_id:package_id
    }
  });
// export const pricing_data = (grade) => ({
//     type: 'pricing_data',
//     payload: { 
//         grade: grade,
//     }
//   });

  export const pricing_type = (price, type, grade) => ({
    type: 'pricing_type',
    payload: { 
        price: price,
        type: type,    
        grade: grade,    
    }
  });
