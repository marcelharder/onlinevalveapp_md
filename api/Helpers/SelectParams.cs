namespace api.Helpers
{
    public class SelectParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;

        private int pageSize = 10;

        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }

        public string Position { get; set; }
        public string UserId { get; set; }
        public string Age { get; set; }
        public string BioPref { get; set; }
        public int ValveSize { get; set; }
        public string Size { get; set; }
        public int Height { get; set; }
        public int Weight { get; set; }
        public string lifeStyle { get; set; }
        public double requiredTFD { get; set; }
        public int Gender {get; set;}

       
        public string OrderBy { get; set; }
        public int HospitalNo { get; set; }

    }
}