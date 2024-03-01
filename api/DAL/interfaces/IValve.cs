using System.Collections.Generic;
using System.Threading.Tasks;
using api.DAL.dtos;
using api.DAL.models;
using api.Helpers;

namespace api.DAL.Interfaces
{
    public interface IValve
    {
        Task<List<Class_Valve>> getValvesBySoort(int soort, int position);
        Task<List<Class_Valve>> getAllAorticValves(int hospitalId);
        Task<List<Class_Valve>> getAllMitralValves(int hospitalId);
        List<Class_Valve> getValvesByHospitalAndCode(int hospital, string model_code);
        Task<ValveForReturnDTO> getValveBySerial(string serial, string whoWantsToKnow);
        Task<ValveForReturnDTO> getValveById(int id);

        Task<string> getTFD(string model, string size);
        Task<double> calculateIndexedFTD(int weight, int height, double tfd);

        Task<string> markValveAsImplantedAsync(int id, int procedureId);
        Task<string> markValveBySerialAsync(string serial, int status, int procedureId);

        void updateValve(ValveForReturnDTO p);
        void Add(Class_Valve v);
        Task<bool> SaveAll();


        Task<List<Class_Valve>> getValvesForSOAAsync(ValveParams v);
        
        //Task<Class_Valve> valveBasedOnTypeOfValve(int id);
        Task<List<Class_Valve>> getAllProductsByVendor(int hospital, int vendor);
        Task<string> getValveByProductCode(string productCode);
        Task<List<ExpiringProduct>> getValveExpiry(int months);

        #region // methods that get the sizes or display in the graphs
        Task<List<int>> getAorticMechanicalSizes(int hospitalId);
        Task<List<int>> getAorticBioSizes(int hospitalId);

        Task<List<int>> getMitralMechanicalSizes(int hospitalId);
        Task<List<int>> getMitralBioSizes(int hospitalId);
        Task<List<int>> getConduitSizes(int hospitalId);
        Task<List<int>> getRingSizes(int hospitalId);
        #endregion

        #region // methods that record and display valve transfers from one hospital to the other
        List<Class_Transfer_forReturn> getValveTransfers(int ValveId);
        Task<Class_Transfer> getValveTransferDetails(int TransferId);
        Task<int> removeValveTransfer(int TransferId);
        void addValveTransfer(Class_Transfer ct);
        Task<int> updateValveTransferAsync(Class_Transfer_forUpload ct);
        Task<int> deleteValveTransferAsync(int Id);

        #endregion
        #region // determines the selection process
        Task<PagedList<Class_Valve>> getSuggestedValves(SelectParams sp);
        Task<int> removeValve(int id);
        #endregion


    }
}