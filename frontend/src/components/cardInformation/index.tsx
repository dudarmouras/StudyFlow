import { Card, CardContent , CardHeader, CardTitle } from '../ui/card';
import { LucideIcon} from 'lucide-react';


interface CardInformationProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export default function CardInformation({icon: Icon, title, description}:CardInformationProps){
    return (
        <Card className='w-70 h-full border shadow-[#ae44c6] shadow-2xs border-gray-200'>
            <div className='flex justify-center items-center '>
                <div className='border rounded-xl w-12 h-12 flex justify-center items-center bg-linear-to-br from-pink-400 to-purple-500'>
                    <Icon className='flex justify-center items-center w-8 h-8 text-white'/>
                </div>
            </div>

            <CardHeader>
                <CardTitle className='text-gray-700 font-semibold text-xl flex justify-center items-center '>{title}</CardTitle>
            </CardHeader>
            <CardContent className='flex justify-center items-center mr-2 ml-2'>
                <p className='text-[#56335e] text-shadow-[#ab3cba] font-normal text-sm flex justify-center items-center'>{description}</p>
            </CardContent>
        </Card>

    );
}
