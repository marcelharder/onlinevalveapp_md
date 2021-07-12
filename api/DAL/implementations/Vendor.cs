using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using api.DAL.Code;
using api.DAL.Interfaces;
using api.DAL.models;
using api.Helpers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace api.DAL.Implementations
{
    public class Vendor : IVendor
    {
        private dataContext _context;
        private SpecialMaps _special;



        public Vendor(dataContext context, SpecialMaps special)
        {
            _context = context;
            _special = special;


        }

        

       

        public async Task<Class_Vendors> getVendor(int id)
        {
            var result = await _context.Vendors.FirstOrDefaultAsync(x => x.database_no == id.ToString());
            return result;
        }
        public async Task<List<Class_Item>> getVendors()
        {
            var result = new List<Class_Item>();
            Class_Item ci;
            var vendors = await _context.Vendors.ToListAsync();
            foreach (Class_Vendors cv in vendors)
            {
                if (cv.description != "Store")
                {
                    ci = new Class_Item();
                    ci.Value = Convert.ToInt32(cv.database_no);
                    ci.Description = cv.description;
                    result.Add(ci);
                }

            }

            return result;

        }
        public async Task<PagedList<Class_Vendors>> getVendorsFull(UserParams userParams)
        {
            var vendors = _context.Vendors.AsQueryable();
            return await PagedList<Class_Vendors>.CreateAsync(vendors, userParams.PageNumber, userParams.PageSize);
            
        }
        public async Task<bool> SaveAll() { return await _context.SaveChangesAsync() > 0; }
        public void Add<T>(T entity) where T : class{ _context.Add(entity); }
        public void Delete<T>(T entity) where T : class{ _context.Remove(entity); }
        public void Update<T>(T entity) where T : class{ _context.Update(entity); }

        

        
    }
}