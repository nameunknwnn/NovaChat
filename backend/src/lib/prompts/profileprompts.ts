export function SYSTEM_PROMPT( name?:string, occupation?:string,traits?:string,preferences?:string){
    return(
        `this is the name of the person the agent needs to call him this ${name} 
this is the occupation of the person the agent needs to remeber this ${occupation}  

according to ${name} you should have these traits ${traits} 

and these are extra preferences by the user ${preferences}


now give the response to the user specific to this configuration
`
    )
}