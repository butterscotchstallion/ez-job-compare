import ComputerIcon from '@mui/icons-material/Computer';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AttachMoneyIcon from '@mui/icons-material/EditNote';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import { createElement } from 'react';
import DangerousIcon from '@mui/icons-material/Dangerous';

export default function getTagIconElement(iconName: string): React.ReactElement | undefined {
    const iconMap: any = {
        'EditNote': EditNoteIcon,
        'Computer': ComputerIcon,
        'AttachMoney': AttachMoneyIcon,
        'HomeWork': HomeWorkIcon,
        'ImportantDevicesIcon': ImportantDevicesIcon,
        'InstallDesktop': InstallDesktopIcon,
        'Dangerous': DangerousIcon
    };
    const icon = iconMap[iconName];

    if (!icon) {
        console.warn('No icon defined for '+iconName);
    } else {
        return createElement(icon);
    }
}