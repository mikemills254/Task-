import { FC, ChangeEvent, FocusEvent, ReactNode } from 'react';

interface InputProps {
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    name: string;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onIconAfterClicked?: () => void;
    maxLength?: number;
    type: string;
    ContainerStyles?: string;
    placeholder: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    InputStyles?: string;
    IconBefore: ReactNode;
    IconStyleBefore?: string;
    IconStyleAfter?: string;
    IconAfter: ReactNode;
    disabled?: boolean;
}

const Input: FC<InputProps> = ({
    onFocus,
    name,
    onBlur,
    onIconAfterClicked,
    maxLength,
    type,
    ContainerStyles,
    placeholder,
    value,
    onChange,
    required,
    InputStyles,
    IconBefore,
    IconStyleBefore,
    IconStyleAfter,
    IconAfter,
    disabled,
}) => {
    return (
        <div className={`${ContainerStyles} flex items-center border-[1.5px] border-[#00a885] rounded h-[40px] w-[100%]`}>
            {IconBefore && <div className={`m-4 text-[#00a885] hover:cursor-pointer ${IconStyleBefore}`}>{IconBefore}</div>}
            <input
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                type={type}
                maxLength={maxLength}
                onFocus={onFocus}
                name={name}
                onBlur={onBlur}
                disabled={disabled}
                className={`${InputStyles} w-[100%] h-[100%] rounded focus:outline-none`}
            />
            {IconAfter && (
                <div onClick={onIconAfterClicked} className={`m-4 hover:cursor-pointer text-[#00a885] ${IconStyleAfter}`}>
                {IconAfter}
                </div>
            )}
        </div>
    );
};

export default Input;
