using System.Collections.Generic;
using System.Threading.Tasks;
using api.DAL.models;

namespace api.DAL.Interfaces
{
   public interface IVendor
    {
        Task<Class_Vendors> getVendor(int id);
        
        Task<List<Class_Item>> getVendors();
        Task<int> updateVendor(Class_Vendors cv);
        void Add(Class_Vendors v);
        Task<bool> SaveAll();
    } 
}