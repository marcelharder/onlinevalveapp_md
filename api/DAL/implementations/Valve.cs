using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DAL.dtos;
using api.DAL.Interfaces;
using api.DAL.models;
using Microsoft.EntityFrameworkCore;
using api.DAL.Code;
using api.Helpers;

namespace api.DAL.Implementations
{

    public class Valve : IValve
    {
        private dataContext _context;
        private SpecialMaps _special;
        private IHospital _hospital;
        public Valve(dataContext context, SpecialMaps special, IHospital hospital)
        {
            _context = context;
            _special = special;
            _hospital = hospital;
        }
        public async Task<ValveForReturnDTO> getValveById(int id)
        {
            var result = await _context.Valves.FirstOrDefaultAsync(x => x.ValveId == id);
            return await _special.mapToValveForReturnAsync(result);
        }
        public async Task<string> getValveByProductCode(string productCode)
        {
            var result = await _context.ValveCodes.FirstOrDefaultAsync(x => x.uk_code == productCode);
            return result.Description;
        }
        public async Task<ValveForReturnDTO> getValveBySerial(string serial, string whoWantsToKnow)
        {
            var result = await _context.Valves.FirstOrDefaultAsync(x => x.Serial_no == serial);
            if (result == null) { return null; }
            else
            {
                // whoWantsToKnow can be '1' which is the case when a vendor requests the valve

                // or anything else, which when the hospital person requests the valve
                if (whoWantsToKnow == "1")
                {
                    var currentVendor = await _special.getCurrentVendorAsync();
                    if (result.Vendor_code != currentVendor.ToString()) { result = null; }
                }
                else
                {
                    if (result.implanted != 0) { result = null; }
                    else
                    {
                        if (result.Expiry_date < DateTime.UtcNow) { return null; }
                    }
                }
                if (result == null) { return null; }
                else
                {
                    return await _special.mapToValveForReturnAsync(result);
                }
            }
        }
        public async Task<List<Class_Valve>> getValvesBySoort(int soort, int position)
        {
            ValveParams vp = new ValveParams();
            vp.HospitalNo = await _special.getCurrentUserHospitalId();
            vp.Soort = soort;
            vp.Position = position;
            vp.Size = 0;

            return await methodXAsync(vp);
        }
        public async Task<bool> SaveAll() { return await _context.SaveChangesAsync() > 0; }
        public void Add(Class_Valve v) { _context.Valves.Add(v); }
        public void updateValve(ValveForReturnDTO p) { _context.Valves.Update(_special.mapToValveFromReturn(p)); }
        public async Task<Class_Valve> valveBasedOnTypeOfValve(int id)
        {
            var selectedValveCode = await _context.ValveCodes.FirstOrDefaultAsync(x => x.No == id);
            var val = await _special.getValveFromValveCodeAsync(selectedValveCode);
            return val;
        }
        public List<Class_Valve> getValvesByHospitalAndCode(int hospital, string model_code)
        {
            var result = _context.Valves.Where(x => x.Model_code == model_code).AsQueryable();
            result = result.Where(s => s.Hospital_code == hospital);
            result = result.Where(s => s.implanted == 0);
            result = result.Where(s => s.Expiry_date > DateTime.UtcNow);
            result.OrderBy(c => c.Expiry_date);
            return result.ToList();
        }
        public List<Class_Valve> getAlmostExpiringProductsThreeMonths(string hospital, DateTime compareDate, int currentVendor)
        {

            var result = _context.Valves.Where(x => x.Hospital_code == Convert.ToInt32(hospital)).AsQueryable();
            if (result.Count() != 0)
            {
                result = result.Where(s => s.implanted == 0);
                result = result.Where(s => s.Expiry_date <= compareDate);
                result = result.Where(s => s.Vendor_code == currentVendor.ToString());
                result.OrderBy(c => c.Expiry_date);
                return result.ToList();
            }

            return null;

        }
        public async Task<List<Class_Valve>> getAllProductsByVendor(int hospital, int vendor)
        {
            var result = _context.Valves.Where(x => x.Hospital_code == hospital).AsQueryable();
            result = result.Where(s => s.implanted == 0);
            result = result.Where(s => s.Vendor_code == vendor.ToString());
            result = result.Where(s => s.Expiry_date > DateTime.UtcNow);
            result.OrderBy(c => c.Expiry_date);
            return await result.ToListAsync();
        }
        public async Task<List<ExpiringProduct>> getValveExpiry(int months)
        {
            var expiringValves = new List<ExpiringProduct>();
            var currentVendor = await _special.getCurrentVendorAsync();
            if (currentVendor != 0)
            { // filter out users that are not vendor employees
                var listOfHospitals = new List<Class_Hospital>();
                listOfHospitals = await _hospital.getSphListFull();

                foreach (Class_Hospital h in listOfHospitals)
                {
                    var test = getAlmostExpiringProductsThreeMonths(h.HospitalNo, getCompareDate(months), currentVendor);
                    if (test != null)
                    {
                        foreach (Class_Valve cv in test)
                        {
                            expiringValves.Add(await _special.mapValveToExpiringProduct(cv, months));
                        }
                    }
                    return expiringValves;
                }
            }
            return expiringValves;
        }
        private DateTime getCompareDate(int m)
        {
            DateTime compareDate;
            if (m == 3) { compareDate = DateTime.Now.AddDays(90); return compareDate; }
            if (m == 1) { compareDate = DateTime.Now.AddDays(30); return compareDate; }
            return new DateTime();
        }
        public async Task<List<int>> getAorticMechanicalSizes(int hospitalId)
        {
            var help = new List<int>();
            var size_19 = 0; var size_21 = 0; var size_23 = 0;
            var size_25 = 0; var size_27 = 0; var size_29 = 0;
            var size_31 = 0; var size_33 = 0;

            await Task.Run(() =>
            {
                var result = _context.Valves.Where(x => x.Hospital_code == hospitalId).AsQueryable();
                result = result.Where(s => s.implanted == 0);
                result = result.Where(s => s.Expiry_date > DateTime.UtcNow);
                result = result.Where(s => s.Type == "Mechanical");
                result = result.Where(s => s.Implant_position == "Aortic");

                // get the valves sizes
                foreach (Class_Valve cv in result)
                {
                    if (cv.Size == "19") { size_19++; };
                    if (cv.Size == "21") { size_21++; };
                    if (cv.Size == "23") { size_23++; };
                    if (cv.Size == "25") { size_25++; };
                    if (cv.Size == "27") { size_27++; };
                    if (cv.Size == "29") { size_29++; };
                    if (cv.Size == "31") { size_31++; };
                    if (cv.Size == "33") { size_33++; };
                }
                help.Add(size_19); help.Add(size_21); help.Add(size_23);
                help.Add(size_25); help.Add(size_27); help.Add(size_29);
                help.Add(size_31); help.Add(size_33);
            });
            return help;
        }
        public async Task<List<int>> getAorticBioSizes(int hospitalId)
        {
            var help = new List<int>();
            var size_19 = 0; var size_21 = 0; var size_23 = 0;
            var size_25 = 0; var size_27 = 0; var size_29 = 0;
            var size_31 = 0; var size_33 = 0;

            await Task.Run(() =>
            {
                var result = _context.Valves.Where(x => x.Hospital_code == hospitalId).AsQueryable();
                result = result.Where(s => s.implanted == 0);
                result = result.Where(s => s.Expiry_date > DateTime.UtcNow);
                result = result.Where(s => s.Type == "Biological");
                result = result.Where(s => s.Implant_position == "Aortic");

                // get the valves sizes
                foreach (Class_Valve cv in result)
                {
                    if (cv.Size == "19") { size_19++; };
                    if (cv.Size == "21") { size_21++; };
                    if (cv.Size == "23") { size_23++; };
                    if (cv.Size == "25") { size_25++; };
                    if (cv.Size == "27") { size_27++; };
                    if (cv.Size == "29") { size_29++; };
                    if (cv.Size == "31") { size_31++; };
                    if (cv.Size == "33") { size_33++; };
                }
                help.Add(size_19); help.Add(size_21); help.Add(size_23);
                help.Add(size_25); help.Add(size_27); help.Add(size_29);
                help.Add(size_31); help.Add(size_33);
            });
            return help;
        }
        public async Task<List<int>> getMitralMechanicalSizes(int hospitalId)
        {
            var help = new List<int>();
            var size_19 = 0; var size_21 = 0; var size_23 = 0;
            var size_25 = 0; var size_27 = 0; var size_29 = 0;
            var size_31 = 0; var size_33 = 0;

            await Task.Run(() =>
            {
                var result = _context.Valves.Where(x => x.Hospital_code == hospitalId).AsQueryable();
                result = result.Where(s => s.implanted == 0);
                result = result.Where(s => s.Expiry_date > DateTime.UtcNow);
                result = result.Where(s => s.Type == "Biological");
                result = result.Where(s => s.Implant_position == "Mitral");

                // get the valves sizes
                foreach (Class_Valve cv in result)
                {
                    if (cv.Size == "19") { size_19++; };
                    if (cv.Size == "21") { size_21++; };
                    if (cv.Size == "23") { size_23++; };
                    if (cv.Size == "25") { size_25++; };
                    if (cv.Size == "27") { size_27++; };
                    if (cv.Size == "29") { size_29++; };
                    if (cv.Size == "31") { size_31++; };
                    if (cv.Size == "33") { size_33++; };
                }
                help.Add(size_19); help.Add(size_21); help.Add(size_23);
                help.Add(size_25); help.Add(size_27); help.Add(size_29);
                help.Add(size_31); help.Add(size_33);
            });
            return help;
        }
        public async Task<List<int>> getMitralBioSizes(int hospitalId)
        {
            var help = new List<int>();
            var size_19 = 0; var size_21 = 0; var size_23 = 0;
            var size_25 = 0; var size_27 = 0; var size_29 = 0;
            var size_31 = 0; var size_33 = 0;

            await Task.Run(() =>
            {
                var result = _context.Valves.Where(x => x.Hospital_code == hospitalId).AsQueryable();
                result = result.Where(s => s.implanted == 0);
                result = result.Where(s => s.Expiry_date > DateTime.UtcNow);
                result = result.Where(s => s.Type == "Biological");
                result = result.Where(s => s.Implant_position == "Mitral");

                // get the valves sizes
                foreach (Class_Valve cv in result)
                {
                    if (cv.Size == "19") { size_19++; };
                    if (cv.Size == "21") { size_21++; };
                    if (cv.Size == "23") { size_23++; };
                    if (cv.Size == "25") { size_25++; };
                    if (cv.Size == "27") { size_27++; };
                    if (cv.Size == "29") { size_29++; };
                    if (cv.Size == "31") { size_31++; };
                    if (cv.Size == "33") { size_33++; };
                }
                help.Add(size_19); help.Add(size_21); help.Add(size_23);
                help.Add(size_25); help.Add(size_27); help.Add(size_29);
                help.Add(size_31); help.Add(size_33);
            });
            return help;
        }
        public async Task<List<int>> getConduitSizes(int hospitalId)
        {
            var help = new List<int>();
            var size_19 = 0; var size_21 = 0; var size_23 = 0;
            var size_25 = 0; var size_27 = 0; var size_29 = 0;
            var size_31 = 0; var size_33 = 0;

            await Task.Run(() =>
            {
                var result = _context.Valves.Where(x => x.Hospital_code == hospitalId).AsQueryable();
                result = result.Where(s => s.implanted == 0);
                result = result.Where(s => s.Expiry_date > DateTime.UtcNow);
                result = result.Where(s => s.Type == "Valved_Conduit");

                // get the valves sizes
                foreach (Class_Valve cv in result)
                {
                    if (cv.Size == "19") { size_19++; };
                    if (cv.Size == "21") { size_21++; };
                    if (cv.Size == "23") { size_23++; };
                    if (cv.Size == "25") { size_25++; };
                    if (cv.Size == "27") { size_27++; };
                    if (cv.Size == "29") { size_29++; };
                    if (cv.Size == "31") { size_31++; };
                    if (cv.Size == "33") { size_33++; };
                }
                help.Add(size_19); help.Add(size_21); help.Add(size_23);
                help.Add(size_25); help.Add(size_27); help.Add(size_29);
                help.Add(size_31); help.Add(size_33);
            });
            return help;
        }
        public async Task<List<int>> getRingSizes(int hospitalId)
        {
            var help = new List<int>();
            var size_19 = 0; var size_21 = 0; var size_23 = 0;
            var size_25 = 0; var size_27 = 0; var size_29 = 0;
            var size_31 = 0; var size_33 = 0;

            await Task.Run(() =>
            {
                var result = _context.Valves.Where(x => x.Hospital_code == hospitalId).AsQueryable();
                result = result.Where(s => s.implanted == 0);
                result = result.Where(s => s.Expiry_date > DateTime.UtcNow);
                result = result.Where(s => s.Type == "Annuloplasty_Ring");

                // get the valves sizes
                foreach (Class_Valve cv in result)
                {
                    if (cv.Size == "19") { size_19++; };
                    if (cv.Size == "21") { size_21++; };
                    if (cv.Size == "23") { size_23++; };
                    if (cv.Size == "25") { size_25++; };
                    if (cv.Size == "27") { size_27++; };
                    if (cv.Size == "29") { size_29++; };
                    if (cv.Size == "31") { size_31++; };
                    if (cv.Size == "33") { size_33++; };
                }
                help.Add(size_19); help.Add(size_21); help.Add(size_23);
                help.Add(size_25); help.Add(size_27); help.Add(size_29);
                help.Add(size_31); help.Add(size_33);
            });
            return help;
        }
        public List<Class_Transfer_forReturn> getValveTransfers(int ValveId)
        {
            var help = new List<Class_Transfer_forReturn>();
            var result = _context.Transfers.AsQueryable();
            result = result.Where(s => s.ValveId == ValveId);
            foreach (Class_Transfer ct in result) { help.Add(_special.mapToTransfersToReturn(ct)); }
            return help;
        }
        public async Task<Class_Transfer> getValveTransferDetails(int id)
        {
            var result = await _context.Transfers.FirstOrDefaultAsync(x => x.Id == id);
            return result;
        }
        public async Task<int> removeValveTransfer(int TransferId)
        {
            var help = 0;
            var result = await _context.Transfers.FirstOrDefaultAsync(x => x.Id == TransferId);
            _context.Transfers.Remove(result);

            if (await SaveAll())
            {
                help = 1;
                return help;
            }
            return help;
        }
        public async Task<int> removeValve(int Id)
        {
            var help = 0;
            var result = await _context.Valves.FirstOrDefaultAsync(x => x.ValveId == Id);
            _context.Valves.Remove(result);

            if (await SaveAll())
            {
                help = 1;
                return help;
            }
            return help;
        }
        public void addValveTransfer(Class_Transfer v) { _context.Transfers.Add(v); }
        public async Task<int> updateValveTransferAsync(Class_Transfer_forUpload p)
        {
            var updateResult = 1;
            var current = await getValveTransferDetails(p.Id);
            var itemToUpdate = _special.mapToTransferFromUpdateAsync(p, current);
            _context.Transfers.Update(itemToUpdate);
            if (await SaveAll()) { updateResult = 2; return updateResult; }
            return updateResult;
        }

        public async Task<List<Class_Valve>> getValvesForSOAAsync(ValveParams v)
        {
            // v.HospitalNo = await _special.getCurrentUserHospitalId();
            return await methodXAsync(v);
        }

        private async Task<List<Class_Valve>> methodXAsync(ValveParams v)
        {
            var result = new List<Class_Valve>();
            await Task.Run(() =>
            {
                var soort = v.Soort;
                var position = v.Position;
                var size = v.Size;
                var _position = "";
                var _currentHospital = v.HospitalNo;
                var help = "";

                switch (soort)
                {
                    case 1: help = "Mechanical"; break;
                    case 2: help = "Biological"; break;
                    case 3: help = "Valved_Conduit"; break;
                    case 4: help = "Annuloplasty_Ring"; break;
                    case 5: help = "Pericardial Patch"; break;
                }
                switch (position)
                {
                    case 1: _position = "Aortic"; break;
                    case 2: _position = "Mitral"; break;
                    case 3: _position = "Other"; break;
                    case 4: _position = "Tricuspid"; break;
                }
                var resultx = _context.Valves.Where(x => x.Type == help).AsQueryable();
                resultx = resultx.Where(s => s.Hospital_code == _currentHospital);
                resultx = resultx.Where(s => s.Implant_position == _position);
                resultx = resultx.Where(s => s.implanted == 0);
                if (size != 0) { resultx = resultx.Where(s => s.Size == size.ToString()); }
                resultx = resultx.Where(s => s.Expiry_date > DateTime.UtcNow);
                resultx.OrderBy(c => c.Expiry_date);
                result = resultx.ToList();

            });
            return result;
        }

        public async Task<string> markValveAsImplantedAsync(int id, int procedureId)
        {
            var valve = await _context.Valves.FirstOrDefaultAsync(x => x.ValveId == id);
            valve.implanted = 1;
            valve.Procedure_id = procedureId;
            valve.Implant_date = DateTime.Now;
            _context.Valves.Update(valve);
            if (await SaveAll()) { return "updated"; }
            return "";

        }
        public async Task<string> markValveBySerialAsync(string serial, int status, int procedureId)
        {
            var updateResult = '1';
            var result = await _context.Valves.FirstOrDefaultAsync(x => x.Serial_no == serial);
            if (result == null) { return null; }
            else
            {
                result.implanted = status;
                result.Procedure_id  = procedureId;
                _context.Update(result);
                if (await SaveAll()) { updateResult = '2'; return updateResult.ToString(); }
            }
            return updateResult.ToString();
        }
        // depending on the patient data this method returns the suggested valves
        public async Task<PagedList<Class_Valve>> getSuggestedValves(SelectParams sp)
        {
            if (sp.BioPref == "1")
            {
                var result = await _context.Valves
                .Where(x => x.Hospital_code == sp.HospitalNo)
                .Where(s => s.implanted == 0)
                .Where(s => s.Size == sp.Size)
                .Where(s => s.Implant_position == sp.Position)
                .Where(s => s.Type == "Biological")
                .Where(s => s.Expiry_date > DateTime.UtcNow)
                .OrderBy(c => c.Expiry_date).ToListAsync();
                foreach (Class_Valve cv in result) { cv.TFD = await calculateIndexedFTD(sp.Height, sp.Weight, cv.TFD); }
                return PagedList<Class_Valve>.Create(result, sp.PageNumber, sp.PageSize);
            }
            else
            {
                var result = await _context.Valves
                .Where(x => x.Hospital_code == sp.HospitalNo)
                .Where(s => s.Implant_position == sp.Position)
                .Where(s => s.implanted == 0)
                .Where(s => s.Size == sp.Size)
                .Where(s => s.Expiry_date > DateTime.UtcNow)
                .OrderBy(c => c.Expiry_date).ToListAsync();
                foreach (Class_Valve cv in result) { cv.TFD = await calculateIndexedFTD(sp.Height, sp.Weight, cv.TFD); }
                return PagedList<Class_Valve>.Create(result, sp.PageNumber, sp.PageSize);
            }
        }

        public async Task<List<Class_Valve>> getAllAorticValves(int hospitalId)
        {
            var result = await _context.Valves.Where(x => x.Hospital_code == hospitalId)
             .Where(s => s.implanted == 0)
             .Where(s => s.Implant_position == "Aortic")
             .Where(s => s.Expiry_date > DateTime.UtcNow)
             .OrderBy(c => c.Expiry_date).ToListAsync();
            return result;
        }
        
        public async Task<List<Class_Valve>> getAllMitralValves(int hospitalId)
        {
            var result = await _context.Valves.Where(x => x.Hospital_code == hospitalId)
           .Where(s => s.implanted == 0)
           .Where(s => s.Implant_position == "Mitral")
           .Where(s => s.Expiry_date > DateTime.UtcNow)
           .OrderBy(c => c.Expiry_date).ToListAsync();
            return result;
        }

        public async Task<string> getTFD(string pc, string size)
        {
            // get the TFD from the valvecode
            var f = await _context.ValveCodes.Include(a => a.Valve_size).FirstOrDefaultAsync(x => x.uk_code == pc);
            var a = f.Valve_size.ToList();
            var b = a.Find(a => a.Size == Convert.ToInt32(size));
            return b.EOA.ToString();
        }

        public async Task<double> calculateIndexedFTD(int height, int weight, double TFD)
        {
            var help = 0.0;
            await Task.Run(() =>
            {
                var bsa = 0.007184 * (Math.Pow(height, 0.725) * Math.Pow(weight, 0.425));
                help = TFD / bsa;
            });
            return help;
        }

        
    }
}