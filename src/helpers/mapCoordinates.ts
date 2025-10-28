// this consist of the function which will give the name of the region from lat and lon value. This function is to be useeed in frontend only

const regionData = [
    { lat: 20.51, lon: 86.42, name: "Sujanagar" },
    { lat: 20.51, lon: 86.45, name: "Jajpur border" },
    { lat: 20.51, lon: 86.48, name: "Fakirabad" },
    { lat: 20.51, lon: 86.51, name: "Purusottampur" },
    { lat: 20.51, lon: 86.54, name: "Ayaba" },
    { lat: 20.51, lon: 86.57, name: "Badajaria" },
    { lat: 20.51, lon: 86.6, name: "Nayakot" },
    { lat: 20.51, lon: 86.63, name: "Saanta pur" },
    { lat: 20.54, lon: 86.42, name: "jajpur road" },
    { lat: 20.54, lon: 86.45, name: "Trilochanpur" },
    { lat: 20.54, lon: 86.48, name: "Itipur" },
    { lat: 20.54, lon: 86.51, name: "Panturi" },
    { lat: 20.54, lon: 86.54, name: "Dihapada" },
    { lat: 20.54, lon: 86.57, name: "Khadianta" },
    { lat: 20.54, lon: 86.6, name: "Osangara" },
    { lat: 20.54, lon: 86.63, name: "Mulagain" },
    { lat: 20.57, lon: 86.42, name: "Jamara" },
    { lat: 20.57, lon: 86.45, name: "Palakana" },
    { lat: 20.57, lon: 86.48, name: "Bharsing" },
    { lat: 20.57, lon: 86.51, name: "Pattamundai" },
    { lat: 20.57, lon: 86.54, name: "Gandakul College Rd" },
    { lat: 20.57, lon: 86.57, name: "College Rd, Pattamundai" },
    { lat: 20.57, lon: 86.6, name: "narendrapur" },
    { lat: 20.57, lon: 86.63, name: "Malipur" },
    { lat: 20.6, lon: 86.42, name: "DhumatSasan" },
    { lat: 20.6, lon: 86.45, name: "Indupur" },
    { lat: 20.6, lon: 86.48, name: "Dakhina Musadia" },
    { lat: 20.6, lon: 86.51, name: "Musadia" },
    { lat: 20.6, lon: 86.54, name: "Nilakanthapur" },
    { lat: 20.6, lon: 86.57, name: "Pattamundai" },
    { lat: 20.6, lon: 86.6, name: "Bilikana" },
    { lat: 20.6, lon: 86.63, name: "Palapatana" },
  ];
  
  export default function getRegionName(lat: number, lon: number) {
    const region = regionData.find(
      (r) => r.lat === lat && r.lon === lon
    );
    return region ? region.name : "Region not found";
  }
  
  