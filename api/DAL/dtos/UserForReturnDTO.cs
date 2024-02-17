using System;
using System.Collections.Generic;
using api.DAL.models;

namespace api.DAL.dtos
{
    public class UserForReturnDTO
    {
        public int userId { get; set; }
        public string username { get; set; }
        public string gender { get; set; }
         public string email { get; set; }
        public int age { get; set; }
        public DateTime created { get; set; }
        public DateTime lastActive { get; set; }
        public string knownAs { get; set; }
        public string mobile { get; set; }
        public string Implant_position { get; set; }
        public string introduction { get; set; }
        public string myProperty { get; set; }
        public string interests { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public List<PhotoForDetailedDto> photos { get; set; }
        public string photoUrl { get; set; }
        public string vendorName { get; set; }
        public int vendorCode { get; set; }
        public int hospitalCode { get; set; }
        public string userRole { get; set; }
        public string worked_in { get; set; }
    }
}