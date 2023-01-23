using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.Linq;
using Newtonsoft.Json;
using System.Collections.Generic;
using api.DAL.models;
using api.DAL.dtos;
using api.Helpers;
using System.Xml.Linq;
using System.IO;
using api.DAL.Interfaces;

namespace api.DAL.Code
{
    public class SpecialMaps
    {



        XElement _testje;
        private dataContext _context;
        private IWebHostEnvironment _env;
        private IHttpContextAccessor _http;

       

        public SpecialMaps(dataContext context, IWebHostEnvironment env,
            IHttpContextAccessor http)
        {
            _context = context;
            _env = env;
            _http = http;
            var content = _env.ContentRootPath;
            var filename = "DAL/data/countries.xml";
            var test = Path.Combine(content, filename);
            XElement testje = XElement.Load($"{test}");
            _testje = testje;

        }
        public async Task<Class_Hospital> getHospital(int id)
        {
            var help = id.ToString().makeSureTwoChar();
            return await _context.Hospitals.FirstOrDefaultAsync(h => h.HospitalNo == help);
        }

        #region <!-- country stuff -->   
        public string getCountryNameFromISO(string code)
        {
            var result = "";
            IEnumerable<XElement> op = _testje.Descendants("Country");
            foreach (XElement s in op)
            {
                if (s.Element("ISO").Value == code)
                {
                    return s.Element("Description").Value;
                }
            }
            return result;
        }
        public string getCountryIDFromISO(string code)
        {
            var result = "";
            IEnumerable<XElement> op = _testje.Descendants("Country");
            foreach (XElement s in op)
            {
                if (s.Element("ISO").Value == code)
                {
                    return s.Element("ID").Value;
                }
            }
            return result;
        }
        public string getCountryIDFromDescription(string description)
        {
            var result = "";
            IEnumerable<XElement> op = _testje.Descendants("Country");
            foreach (XElement s in op)
            {
                if (s.Element("Description").Value == description)
                {
                    return s.Element("ID").Value;
                }
            }
            return result;
        }
        public string getCountryNameFromID(string id)
        {
            var result = "";
            IEnumerable<XElement> op = _testje.Descendants("Country");
            foreach (XElement s in op)
            {
                if (s.Element("ID").Value == id)
                {
                    return s.Element("Description").Value;
                }
            }
            return result;
        }




        public string setCountryCode(string naam)
        {
            var result = "";
            IEnumerable<XElement> op = _testje.Descendants("Country");
            foreach (XElement s in op)
            {
                if (s.Element("Description").Value == naam)
                {
                    return s.Element("ISO").Value;
                }
            }
            return result;
        }
        public string getIsoCode(string code)
        {
            var result = "";
            IEnumerable<XElement> op = _testje.Descendants("Country");
            foreach (XElement s in op)
            {
                if (s.Element("ID").Value == code)
                {
                    return s.Element("ISO").Value;
                }
            }
            return result;
        }
        public List<Class_Item> getListOfCountries()
        {
            IEnumerable<XElement> op = _testje.Descendants("Country");
            Class_Item ci;
            var cl = new List<Class_Item>();
            foreach (XElement s in op)
            {
                ci = new Class_Item();
                ci.Description = s.Element("Description").Value;
                ci.Value = Convert.ToInt32(s.Element("ID").Value);
                cl.Add(ci);

            }
            return cl;
        }

        #endregion
        #region <!-- photomappers -->
        public PhotoForReturnDto mapToPhotoForReturn(Photo photoFromRepo)
        {
            var help = new PhotoForReturnDto();
            help.Id = photoFromRepo.Id;
            help.Url = photoFromRepo.Url;
            help.Description = photoFromRepo.Description;
            help.DateAdded = photoFromRepo.DateAdded;
            help.IsMain = photoFromRepo.IsMain;
            help.PublicId = photoFromRepo.PublicId;
            return help;
        }
        public Photo mapToPhoto(PhotoForCreationDto photoDto)
        {
            var help = new Photo();
            help.Url = photoDto.Url;
            help.Description = photoDto.Description;
            help.DateAdded = photoDto.DateAdded;
            help.PublicId = photoDto.PublicId;

            return help;
        }
        public List<PhotoForDetailedDto> mapToDetailedPhotosToReturn(ICollection<Photo> p)
        {
            var result = new List<PhotoForDetailedDto>();
            foreach (Photo ph in p)
            {
                var help = new PhotoForDetailedDto();
                help.Id = ph.Id;
                help.Url = ph.Url;
                help.Description = ph.Description;
                help.IsMain = ph.IsMain;
                result.Add(help);
            }
            return result;
        }

        #endregion
        #region <!-- message stuff -->
        public async Task<MessageToReturnDto> mapTomessageToReturnFromMessage(Message message)
        {

            var sender = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.UserId == message.SenderId);
            var recipient = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.UserId == message.RecipientId);

            var m = new MessageToReturnDto();
            m.Id = message.Id;
            m.SenderId = message.SenderId;
            m.SenderKnownAs = sender.Username;
            m.SenderPhotoUrl = sender.Photos.FirstOrDefault(p => p.IsMain == true).Url;
            m.RecipientId = message.RecipientId;
            m.RecipientKnownAs = recipient.Username;
            m.RecipientPhotoUrl = recipient.Photos.FirstOrDefault(p => p.IsMain == true).Url;
            m.Content = message.Content;
            m.IsRead = message.IsRead;
            m.DateRead = message.DateRead;
            m.MessageSent = message.MessageSent;
            return m;
        }
        public async Task<Message> mapToMessageFromMessageForCreationDTOAsync(MessageForCreationDTO mess)
        {
            var m = new Message();

            m.SenderId = mess.SenderId;
            m.Sender = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.UserId == mess.SenderId);

            m.RecipientId = mess.RecipientId;
            m.Recipient = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.UserId == mess.RecipientId);

            m.Content = mess.Content;
            m.MessageSent = mess.MessageSent;
            m.SenderDeleted = false;
            m.RecipientDeleted = false;

            return m;
        }
        public async Task<List<MessageToReturnDto>> mapToListOfmessageToReturnFromListOfMessageAsync(IEnumerable<Message> messagesFromRepo)
        {
            var help = new List<MessageToReturnDto>();
            foreach (Message m in messagesFromRepo)
            {
                help.Add(await mapTomessageToReturnFromMessage(m));
            }
            return help;
        }

        #endregion
        #region <!-- valve mappings -->
        public async Task<Class_Valve> getValveFromValveCodeAsync(Class_TypeOfValve selectedValveCode)
        {
            // a new valve is created here with a valvetype as basis
            var help = new Class_Valve();
            help.No = await getNewValveNumberAsync();// dit is een uniek identifying number
            help.Description = selectedValveCode.Description;
            help.Vendor_code = selectedValveCode.Vendor_code;
            help.Product_code = selectedValveCode.uk_code;
            help.Type = selectedValveCode.Type;
            help.Location = "";
            help.Manufac_date = new DateTime();
            help.Expiry_date = new DateTime();
            help.Serial_no = "";
            help.Model_code = selectedValveCode.Model_code;
            help.PatchSize = "";
            help.Size = "";
            help.TFD = 0.0;
            help.Image = selectedValveCode.image;
            help.Implant_position = selectedValveCode.Implant_position;
            help.Procedure_id = 0;
            help.implanted = 0;
            help.Hospital_code = await getCurrentUserHospitalId();
            help.Implant_date = new DateTime();

            return help;
        }
        public async Task<ValveForReturnDTO> mapToValveForReturnAsync(Class_Valve valve)
        {

            var help = new ValveForReturnDTO();
            help.valveId = valve.ValveId;
            help.No = valve.No;
            help.Vendor_name = await getVendorNameFromVendorCodeAsync(valve.Vendor_code);
            help.Description = valve.Description;
            help.Vendor_code = valve.Vendor_code;
            help.Product_code = valve.Product_code;
            help.Type = valve.Type;
            help.Location = valve.Location;
            help.Manufac_date = valve.Manufac_date;
            help.Expiry_date = valve.Expiry_date;
            help.Serial_no = valve.Serial_no;
            help.Model_code = valve.Model_code;
            help.PatchSize = valve.PatchSize;
            help.Size = valve.Size;
            help.Image = valve.Image;
            help.TFD = valve.TFD;
            help.Implant_position = valve.Implant_position;
            help.Procedure_id = valve.Procedure_id;
            help.implanted = valve.implanted;
            help.Hospital_code = valve.Hospital_code;
            help.Implant_date = valve.Implant_date;

            return help;
        }
        public Class_Valve mapToValveFromReturn(ValveForReturnDTO p)
        {
            var help = new Class_Valve();
            help.ValveId = p.valveId;
            help.No = p.No;
            help.Description = p.Description;
            help.Vendor_code = p.Vendor_code;
            help.Product_code = p.Product_code;
            help.Type = p.Type;
            help.Location = p.Location;
            help.Manufac_date = p.Manufac_date;
            help.Expiry_date = p.Expiry_date;
            help.Serial_no = p.Serial_no;
            help.Model_code = p.Model_code;
            if(p.Type == "Pericardial Patch"){ help.PatchSize = p.PatchSize;}else {help.Size = p.Size;}
            help.TFD = p.TFD;
            help.Image = p.Image;
            help.Implant_position = p.Implant_position;
            help.Procedure_id = p.Procedure_id;
            help.implanted = p.implanted;
            help.Hospital_code = p.Hospital_code;
            help.Implant_date = p.Implant_date;

            return help;
        }

      
        public async Task<ExpiringProduct> mapValveToExpiringProduct(Class_Valve cv, int months)
        {
            var help = new ExpiringProduct();
            var ch = await this.getHospital(cv.Hospital_code);

            help.id = cv.ValveId;
            help.hospital = ch.Naam;
            help.timePeriod = months.ToString() + " months";
            help.description = cv.Description;
            help.expiryDate = cv.Expiry_date;

            help.contact = await this.getContactNameFromCodeAsync(ch.Contact);
            help.email = ch.Email;
            help.country = await this.getCurrentCountryFromLoggedInUser();

            return help;
        }
        #endregion
      
        #region <!-- user mappings -->
        public async Task<UserForReturnDTO> getUserforReturnDTOAsync(User u)
        {
            var help = new UserForReturnDTO();
            help.userId = u.UserId;
            help.username = u.Username;

            if (u.Photos.Count != 0)
            {
                help.photoUrl = u.Photos.FirstOrDefault(p => p.IsMain == true).Url;
                help.photos = this.mapToDetailedPhotosToReturn(u.Photos);
            }


            help.gender = u.Gender;
            if (u.DateOfBirth.Ticks != 0)
            {
                help.age = u.DateOfBirth.CalculateAge();
            }
            else { help.age = 0; }

            help.created = u.Created;
            help.lastActive = u.LastActive;
            help.gender = u.Gender;
            help.knownAs = u.KnownAs;
            help.email = u.Email;
            help.worked_in = u.worked_in;
            help.mobile = u.Mobile;
            help.introduction = u.Introduction;

            if (this.IsLoggedInUserARep(u))
            {
                help.vendorName = u.worked_in;
                help.vendorCode = await this.getIdFromVendorName(help.vendorName);
            }
            else
            {
                help.hospitalCode = u.hospital_id;
            }

            help.userRole = u.Role;
            help.interests = u.Interests;
            help.city = u.City;
            help.country = getCountryNameFromISO(u.Country);


            return help;


        }
        public async Task<User> mapToUserFromUserToReturn(UserForReturnDTO ufr)
        {
            // var currentUser = await _user.GetUser(ufr.userId);
            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.UserId == ufr.userId);
            currentUser.City = ufr.city;
            currentUser.Role = ufr.userRole;
            currentUser.Gender = ufr.gender;
            currentUser.Username = ufr.username;
            currentUser.Email = ufr.email;
            currentUser.Mobile = ufr.mobile;
            currentUser.Country = setCountryCode(ufr.country);
            currentUser.Introduction = ufr.introduction;
            currentUser.Interests = ufr.interests;
            currentUser.hospital_id = ufr.hospitalCode;
            currentUser.worked_in = ufr.worked_in;
            return currentUser;
        }
        public async Task<List<UserForReturnDTO>> mapToListOfUserToReturn(IEnumerable<User> us)
        {
            var help = new List<UserForReturnDTO>();
            foreach (User m in us)
            {
                help.Add(await getUserforReturnDTOAsync(m));
            }
            return help;
        }

        #endregion
        #region <!-- transfermaps -->
        public Class_Transfer_forReturn mapToTransfersToReturn(Class_Transfer result)
        {
            var help = new Class_Transfer_forReturn();
            help.ArrivalCode = result.ArrivalCode;
            help.ArrTime = result.ArrTime;
            help.DepartureCode = result.DepartureCode;
            help.DepTime = result.DepTime;
            help.Reason = result.Reason;
            help.ValveId = result.ValveId;
            help.Id = result.Id;
            return help;

        }
        public Class_Transfer mapToTransferFromUpdateAsync(Class_Transfer_forUpload p, Class_Transfer current_transfer)
        {

            current_transfer.ArrivalCode = p.ArrivalCode;
            current_transfer.ArrTime = p.ArrTime;
            current_transfer.DepartureCode = p.DepartureCode;
            current_transfer.DepTime = p.DepTime;
            current_transfer.Reason = p.Reason;
            current_transfer.ValveId = p.ValveId;
            return current_transfer;
        }
        #endregion
        #region <!-- hospitalmap-->
        public HospitalForReturnDTO getHospitalforReturnDTO(Class_Hospital u)
        {
           HospitalForReturnDTO hr = new HospitalForReturnDTO();
        hr.Naam = u.Naam;
        hr.Adres = u.Adres;
        hr.PostalCode = u.PostalCode;
        hr.HospitalNo = u.HospitalNo;
        hr.Country = u.Country;
        hr.Image = u.Image;
        hr.RefHospitals = u.RefHospitals;
        hr.StandardRef = u.StandardRef;
        hr.Email = u.Email;
        hr.Contact = u.Contact;
        hr.Contact_image = u.Contact_image;
        hr.Telephone = u.Telephone;
        hr.Fax = u.Fax;

           return hr;
        }

        public List<HospitalForReturnDTO> mapToListOfHospitalsToReturn(IEnumerable<Class_Hospital> us)
        {
            var help = new List<HospitalForReturnDTO>();
            foreach (Class_Hospital m in us)
            {
                help.Add(getHospitalforReturnDTO(m));
            }
            return help;
        }
        #endregion
        
        
        
        #region <!-- TFD -->

        public bool isMeasuredSizeEnough(int size, SelectParams sv)
        {
            var help = false;

            return help;
        }

        public double calculateBSA(double height, double weight){
          // DuBois formula
          // height in m en weight in cm
          // BSA = 0.007184 * Height0.725 * Weight0.425  
          var result = 0.0;
          result = .007184 * Math.Pow(height,0.725) * Math.Pow(weight, 0.425);
          result = Math.Round(result, 2);
          return result;
        }
       
        #endregion
        #region <!-- helper functions -->
        private Boolean IsLoggedInUserARep(User u)
        {
            var h = false;
            if (u.Role == "companyadmin" || u.Role == "companyHQ") { h = true; }
            return h;
        }
        private async Task<string> getCurrentCountryFromLoggedInUser()
        {
            var userId = getCurrentUserId();
            var currentUser = await _context.Users.FindAsync(userId);
            return getCountryNameFromISO(currentUser.Country);
        }
        private async Task<int> getNewValveNumberAsync()
        {
            var help = 0;
            var l = new List<int>();
            var totalNumberOfValves = await _context.Valves.ToListAsync();
            foreach (Class_Valve v in totalNumberOfValves) { l.Add(v.No); }
            help = totalNumberOfValves.Count + 1;
            while (l.Contains(help)) { help = help + 1; }
            return help;
        }
        public int getCurrentUserId()
        {
            var userId = _http.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return Convert.ToInt32(userId);
        }
        public async Task<int> getCurrentUserHospitalId()
        {
            var userId = getCurrentUserId();
            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            return currentUser.hospital_id;
        }
        public async Task<int> getCurrentVendorAsync()
        {
            var userId = _http.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var currentUser = await _context.Users.FirstOrDefaultAsync(x => x.UserId == Convert.ToInt16(userId));
            var vendor_name = currentUser.worked_in;
            return await getIdFromVendorName(vendor_name);
        }
        public async Task<string> getVendorNameFromVendorCodeAsync(string code)
        {
            var result = await _context.Vendors.FirstOrDefaultAsync(x => x.database_no == code);
            return result.description;
        }
        public async Task<int> getIdFromVendorName(string x)
        {
            var result = 0;
            var vendor = await _context.Vendors.FirstOrDefaultAsync(h => h.description == x);
            result = Convert.ToInt32(vendor.database_no);
            return result;
        }
        /* public async Task<string[]> getValveSizesAsync(string Product_code)
        {
            var selectedValveCode = await _context.ValveCodes.FirstOrDefaultAsync(x => x.uk_code == Product_code);
            
            
            
            
            
            
            return selectedValveCode.Valve_size.Split(',');
        } */
        public async Task<int> getVendorIdFromName(string name)
        {
            var selectedVendor = await _context.Vendors.FirstOrDefaultAsync(x => x.description == name);
            return Convert.ToInt32(selectedVendor.database_no);
        }
        private async Task<string> getContactNameFromCodeAsync(string contact)
        {
            var selectedUser = await _context.Users.FirstOrDefaultAsync(u => u.UserId == Convert.ToInt32(contact));
            return selectedUser.Username;
        }

        #endregion
    }
}