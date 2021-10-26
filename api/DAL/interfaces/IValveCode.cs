using System.Collections.Generic;
using System.Threading.Tasks;
using api.DAL.dtos;
using api.DAL.models;
using Microsoft.AspNetCore.Mvc;

namespace api.DAL.Interfaces
{
    public interface IValveCode
    {
        Task<List<Class_Item>> getValveCodesPerCountry(int companyId);
        Task<string> getModelCode(int code);
        void Update<T>(T entity) where T : class;
        Task<List<Class_TypeOfValve>> getTypeOfValvesPerCountry(int id);
      
        Task<Class_TypeOfValve> getDetails(int code);
        Task<string> saveDetails(Class_TypeOfValve tpv);
        void Add(Class_TypeOfValve v);
        Task<bool> SaveAll();
        void Delete<T>(T entity) where T : class;
        void Add<T>(T entity) where T : class;
        Task<List<Class_TypeOfValve>>  getAllProducts();
        Task<List<Class_Item>> getAllTPProducts(string type, string position);
        Task<string> deleteSize(int id, int vs);

        Task<Class_Valve_Size> GetSize(int id);
        Task<Class_TypeOfValve> getDetailsByProductCode(string product_code);
        Task<List<ValveCodeSizesDTO>> GetValveCodeSizes(int id);
        Task<Class_TypeOfValve> getDetailsByValveTypeId(int id);
        Task <List<Class_TypeOfValve>> getAllProductsByVTP(string vendor, string type, string position);
    }
}