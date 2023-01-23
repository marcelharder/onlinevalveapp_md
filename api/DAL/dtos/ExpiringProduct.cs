using System;

namespace api.DAL.dtos
{
    public class ExpiringProduct
    {
        public virtual int id { get; set; }
        public virtual string hospital { get; set; }
        public virtual string timePeriod { get; set; }
        public virtual string description { get; set; }
        public virtual DateTime expiryDate { get; set; }
        public virtual string contact { get; set; }
        public virtual string email { get; set; }
        public virtual string country { get; set; }


    }
}