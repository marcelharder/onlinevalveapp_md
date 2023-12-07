using System.Collections.Generic;
using System.Threading.Tasks;
using api.DAL.models;
using api.Helpers;

namespace api.DAL.Interfaces
{
   public interface IVendor
    {
        Task<Class_Vendors> getVendor(int id);
        Task<Class_Vendors> getVendorByName(string name);
        Task<PagedList<Class_Vendors>> getVendorsFull(UserParams userParams);
        Task<List<Class_Item>> getVendors();
        Task<bool> SaveAll();
        void Delete<T>(T entity) where T : class;
        void Add<T>(T entity) where T : class;
        void Update<T>(T entity) where T : class;
        
    } 
}