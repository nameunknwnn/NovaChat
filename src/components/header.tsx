import QueryBox from "./headerComponents/queryBox";
import WelcomeDashboard from "./headerComponents/welcomeDashboard";

const questions=["asndlakna", "asdalaasdasndklasndask","amslkdanlsndak"]

export default function header(){
    return(
        <div className="h-screen">
            <div className="h-3/4"><WelcomeDashboard username="Aditya" questions={questions}/></div>
            <div className="h-1/4">
                <QueryBox text="asndlkasnd"/>
            </div>
        </div>
    )
} 