using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api.DAL.models
{
    public class Valve_Size
    {
        public int SizeId {get; set;}
        public int Size {get; set;}
        public int VTValveTypeId {get; set;}
        public int EOA {get; set;}
        public int VT {get; set;}
        public int ValveTypeId {get; set;}
    }
}