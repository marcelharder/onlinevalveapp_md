using System.Threading.Tasks;

namespace api.DAL.Interfaces
{
    public interface IGenerator
    {
        string generatePDF(string location);

        Task<bool> SaveAll();
        Task<int> DeleteAsync<T>(T entity) where T : class;
    }
}
