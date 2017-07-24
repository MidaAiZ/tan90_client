function infoSet(){
        //Get name
        var st_name=document.getElementById("name").value;
        // Get email
        var ema_index=document.getElementById("email").selectedIndex;      
        document.getElementById("email").options[ema_index].text;          
        document.getElementById("email").options[ema_index].innerHTML;
        var ema_obj=document.getElementById("email");
        for(i=0;i<ema_obj.length;i++){
            if(ema_obj[i].selected==true) {
                var st_email=ema_obj[i].text;
　　        }
　　    }
        //Get gender
        var gen_index=document.getElementById("gender").selectedIndex;      
        document.getElementById("gender").options[gen_index].text;          
        document.getElementById("gender").options[gen_index].innerHTML;
        var gen_obj=document.getElementById("gender");
        for(i=0;i<gen_obj.length;i++){
            if(gen_obj[i].selected==true) {
                var st_gender=gen_obj[i].text;
　　        }
　　    }
        //Get department
        var dep_index=document.getElementById("department").selectedIndex;      
        document.getElementById("department").options[dep_index].text;          
        document.getElementById("department").options[dep_index].innerHTML;
        var dep_obj=document.getElementById("department");
        for(i=0;i<dep_obj.length;i++){
            if(dep_obj[i].selected==true){
                var st_department=dep_obj[i].text;
　　        }
　　    }
        //test
        console.log(st_email);
        console.log(st_name);
        console.log(st_gender);
        console.log(st_department);
    }