import ComputerIcon from '@mui/icons-material/Computer';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AttachMoneyIcon from '@mui/icons-material/EditNote';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';

export default function getTagIconElement(iconName: string): React.ReactElement {
    const iconMap: any = {
        'EditNote': EditNoteIcon,
        'Computer': ComputerIcon,
        'AttachMoney': AttachMoneyIcon,
        'Homework': HomeWorkIcon,
        'ImportantDevicesIcon': ImportantDevicesIcon,
        'InstallDesktop': InstallDesktopIcon
    };
    return iconMap[iconName];
}