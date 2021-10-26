using System.Collections.Generic;
using System.Threading.Tasks;
using api.DAL.models;

namespace api.DAL.Interfaces
{

     public interface IHospital
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<List<Class_Item>> getHospitalVendors();
        Task<List<Class_Item>> getSphList();
        Task<List<Class_Hospital>> getSphListFull();
        Task<List<Class_Hospital>> getNegSphListFull();
        Task<string> addVendor(string vendor, int hospital_id);
        Task<string> changeHospitalForCurrentUser(int hospital_id, User currentUser);
        Task<string> removeVendor(string vendor, int hospital_id);
        Task<Class_Hospital> getDetails(int id);
        Task<string> saveDetails(Class_Hospital hos);
        Task<List<Class_Item>> hospitalsInCountry(string code);
        Task<List<Class_Item>>  getAllHospitals();
        Task<bool> isThisHospitalOVI(int hospital_id);

       
    }
}