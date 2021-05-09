using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DAL.Interfaces;
using api.DAL.models;
using Microsoft.EntityFrameworkCore;
using api.DAL.Code;

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

        public async Task<string> saveDetails(Class_Hospital hos)
        {
            var result = _context.Hospitals.Update(hos);
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

    }
}

