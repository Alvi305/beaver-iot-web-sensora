import { Link } from 'react-router-dom';
import cls from 'classnames';
import './style.less';

interface Props {
    /** Jump address */
    to?: string;

    /** Whether the Logo is Mini */
    mini?: boolean;

    /** placeholder */
    placeholder?: string;

    /** Custom class name */
    className?: string;
}

/**
 * Logo component
 */
const Logo: React.FC<Props> = ({ to, mini, className, placeholder = 'Sensora' }) => {
    return (
        <h3 className={cls('ms-logo', className, { 'ms-logo-mini': mini })}>
            {!to ? (
                <span className="ms-logo-inner" aria-label={placeholder}>
                    {placeholder}
                </span>
            ) : (
                <Link className="ms-logo-inner" to={to} aria-label={placeholder}>
                    {placeholder}
                </Link>
            )}
        </h3>
    );
};

export default Logo;
