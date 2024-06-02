import styles from './styles.module.scss';

//importando atributos do react
import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

//criando interface para utilizar no componente input;
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }

interface TextAreaPropos extends TextareaHTMLAttributes<HTMLTextAreaElement>{}

export function Input({ ...rest }: InputProps) {
    return (
        <div>
            <input className={styles.input} {...rest}></input>
        </div>

    )
}

export function TextArea({...rest}: TextAreaPropos) {
    return (
        <textarea className={styles.input}{...rest}></textarea>
    )
}