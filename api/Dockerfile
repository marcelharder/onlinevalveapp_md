FROM mcr.microsoft.com/dotnet/aspnet:5.0
COPY Release App/
WORKDIR /App


#COPY assets/pdf/*.pdf /App/assets/pdf/
#COPY assets/images/*.jpg /App/assets/images/
#COPY assets/images/*.jpeg /App/assets/images/


ENTRYPOINT [ "dotnet", "api.dll" ]