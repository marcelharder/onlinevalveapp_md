FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
COPY Release/ App/
WORKDIR /App

COPY DAL/data/countries.xml /App/DAL/data/countries.xml
COPY DAL/data/TFD.xml /App/DAL/data/TFD.xml
COPY DAL/data/*.json /App/DAL/data/





ENTRYPOINT [ "dotnet", "api.dll" ]