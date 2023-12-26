using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DAL.Interfaces;
using api.DAL.models;
using Microsoft.EntityFrameworkCore;
using api.DAL.Code;
using api.Helpers;
using api.DAL.dtos;

namespace api.DAL.Implementations
{
    public class Hospital : IHospital
    {
        private SpecialMaps _special;
        private IUserRepository _user;
        private dataContext _context;
        public Hospital(SpecialMaps special, IUserRepository user, dataContext context)
        {
            _special = special;
            _user = user;
            _context = context;
        }
        public async Task<List<Class_Item>> getHospitalVendors()
        {
            var l = new List<Class_Item>();
            var currentUserId = _special.getCurrentUserId();
            var currentUser = await _user.GetUser(currentUserId);
            var currentHospital = await _special.getHospital(currentUser.hospital_id);
            var vendors = currentHospital.vendors;

            var vendorArray = vendors.Split(',');
            foreach (string x in vendorArray)
            {
                var help = new Class_Item();
                help.Value = await _special.getIdFromVendorName(x);
                help.Description = x;
                l.Add(help);
            }
            return l;

        }
        public async Task<List<Class_Item>> getSphList()
        {
            var l = new List<Class_Item>();
            var currentUserId = _special.getCurrentUserId();
            var rep = await _user.GetUser(currentUserId);
            var currentCountry = rep.Country;
            var currentVendor = rep.worked_in; // this means vendor name in a user that is a rep

            var result = _context.Hospitals.AsQueryable();
            result = result.Where(s => s.Country == currentCountry);
            foreach (Class_Hospital x in result)
            {
                var vendorArray = x.vendors.Split(',');
                if (vendorArray.Contains(currentVendor))
                {
                    var help = new Class_Item();
                    help.Value = Convert.ToInt32(x.HospitalNo);
                    help.Description = x.Naam;
                    l.Add(help);
                }
            }
            return l;
        }
        public async Task<List<Class_Hospital>> getSphListFull()
        {
            var l = new List<Class_Hospital>();
            var currentUserId = _special.getCurrentUserId();
            var rep = await _user.GetUser(currentUserId);
            var currentCountry = rep.Country;
            var currentVendor = rep.worked_in; // this means vendor name in a user that is a rep

            var result = _context.Hospitals.AsQueryable();
            result = result.Where(s => s.Country == currentCountry);
            foreach (Class_Hospital x in result)
            {
                var vendorArray = x.vendors.Split(',');
                if (vendorArray.Contains(currentVendor)) { l.Add(x); }
            }
            return l;
        }
        public async Task<List<Class_Hospital>> getNegSphListFull()
        {
            var l = new List<Class_Hospital>();
            var currentUserId = _special.getCurrentUserId();
            var rep = await _user.GetUser(currentUserId);
            var currentCountry = rep.Country;
            var currentVendor = rep.worked_in; // this means vendor name in a user that is a rep

            var result = _context.Hospitals.AsQueryable();
            result = result.Where(s => s.Country == currentCountry);
            foreach (Class_Hospital x in result)
            {
                var vendorArray = x.vendors.Split(',');
                if (!vendorArray.Contains(currentVendor)) { l.Add(x); }
            }
            return l;
        }
        public async Task<string> addVendor(string vendor, int hospital_id)
        {
            var result = "";
            var selectedHospital = await _context.Hospitals.FirstOrDefaultAsync(x => x.Id == hospital_id);
            var vendors = selectedHospital.vendors;

            // make array from string
            var vendorArray = vendors.Split(',');
            // make list from array
            var l = vendorArray.ToList();
            l.Add(vendor);
            // make string again from list
            selectedHospital.vendors = string.Join(",", l);

            _context.Hospitals.Update(selectedHospital);
            if (await _context.SaveChangesAsync() > 0)
            {
                result = "updated";
            }
            else
            {
                result = "update failed";
            }
            return result;
        }
        public async Task<string> removeVendor(string vendor, int hospital_id)
        {
            var result = "";
            var selectedHospital = await _context.Hospitals.FirstOrDefaultAsync(x => x.Id == hospital_id);
            var vendors = selectedHospital.vendors;


            // make array from string
            var vendorArray = vendors.Split(',');
            // make list from array
            var l = vendorArray.ToList();
            l.Remove(vendor);


            // make string again from list
            selectedHospital.vendors = string.Join(",", l);

            _context.Hospitals.Update(selectedHospital);
            if (await _context.SaveChangesAsync() > 0)
            {
                result = "removed";
            }
            else
            {
                result = "remove failed";
            }
            return result;
        }

        public async Task<Class_Hospital> getDetails(int id)
        {
            return await _special.getHospital(id);
        }

        public async Task<string> saveDetails(HospitalForReturnDTO hrdto)
        {
            var help = Convert.ToInt32(hrdto.HospitalNo);
            var selected_record = await getDetails(help);
            selected_record.Naam = hrdto.Naam;
            selected_record.Adres = hrdto.Adres;
            selected_record.PostalCode = hrdto.PostalCode;
            selected_record.Image = hrdto.Image;
            selected_record.RefHospitals = hrdto.RefHospitals;
            selected_record.StandardRef = hrdto.StandardRef;
            selected_record.Email = hrdto.Email;
            selected_record.Contact = hrdto.Contact;
            selected_record.Contact_image = hrdto.Contact_image;
            selected_record.Telephone = hrdto.Telephone;
            selected_record.Fax = hrdto.Fax;
            selected_record.vendors = hrdto.vendors;

           
            var result = _context.Hospitals.Update(selected_record);

            if (await _context.SaveChangesAsync() > 0) { return "updated"; }
            return "failed";
        }

        public async Task<string> changeHospitalForCurrentUser(int hospital_id, User currentUser)
        {
            var result = "0";
            currentUser.hospital_id = hospital_id;
            _context.Users.Update(currentUser);
            if (await _context.SaveChangesAsync() > 0) { result = "1"; }
            return result;
        }

        public async Task<List<Class_Item>> hospitalsInCountry(string code)
        {
            // make from 47 the code of DE
            var _code = _special.getIsoCode(code);


            var l = new List<Class_Item>();
            await Task.Run(() =>
            {
                var result = _context.Hospitals.AsQueryable();
                result = result.Where(s => s.Country == _code);
                foreach (Class_Hospital x in result)
                {
                    var help = new Class_Item();
                    help.Value = Convert.ToInt32(x.HospitalNo);
                    help.Description = x.Naam;
                    l.Add(help);
                }
            });
            return l;
        }

        public async Task<List<Class_Item>> getAllHospitals()
        {
            var l = new List<Class_Item>();
            await Task.Run(() =>
            {
                var result = _context.Hospitals.AsQueryable();

                foreach (Class_Hospital x in result)
                {
                    var help = new Class_Item();
                    help.Value = Convert.ToInt32(x.HospitalNo);
                    help.Description = x.Naam;
                    l.Add(help);
                }
            });
            return l;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);

        }
        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
        public async Task<bool> SaveAll() { return await _context.SaveChangesAsync() > 0; }
        public async Task<bool> isThisHospitalOVI(int hospital_id)
        {
            var h = hospital_id.ToString().makeSureTwoChar();

            if (await _context.Hospitals.AnyAsync(a => a.HospitalNo == h))
            {

                var help = await _context.Hospitals.FirstOrDefaultAsync(a => a.HospitalNo == h);
                if (help.rp == null) return false;
                if (help.rp.Equals("1")) return true;

            }
            else { return false; }
            return false;
        }

        public async Task<PagedList<Class_Hospital>> hospitalsFullInCountry(HospitalParams hp)
        {
            var _code = _special.getIsoCode(hp.code);
            var hospitals = _context.Hospitals.AsQueryable();
            hospitals = hospitals.Where(s => s.Country == _code);

            return await PagedList<Class_Hospital>.CreateAsync(hospitals, hp.PageNumber, hp.PageSize);
           }

        public async Task<string> getNewHospitalCode()
        {
            // find out an empty code
            var newcode = 1;
            List<Class_Hospital> hospitals = new List<Class_Hospital>();
            hospitals = await _context.Hospitals.ToListAsync();
            // ben hier nog bezig, moet nog getest worden
            while (codeExists(newcode, hospitals)) { newcode++; }
            return newcode.ToString().makeSureTwoChar();
        }

        private bool codeExists(int test, List<Class_Hospital> hosp)
        {
            var hospitalcodes = new List<int>();
            foreach (Class_Hospital ch in hosp) { hospitalcodes.Add(Convert.ToInt32(ch.HospitalNo)); }
            if (hospitalcodes.Contains(test)) { return true; } else { return false; }
        }

    }
}

