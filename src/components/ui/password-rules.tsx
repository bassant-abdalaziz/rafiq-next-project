import Image from "next/image";

type PasswordRule = {
  label: string;
  isValid: boolean;
};

type PasswordRulesProps = {
  rules: PasswordRule[];
  title?: string;
};

export function PasswordRules({ rules, title }: PasswordRulesProps) {
  return (
    <div className="rounded-lg bg-surface-low p-4 text-sm text-slate">
      {title && (
        <div>
          <p className="my-3 md:my-0 text-[11px] font-bold uppercase leading-[22.75px] tracking-[0.55px] text-slate">
            {title}
          </p>

          <hr className="hidden md:block mt-3 mb-4 border-slate-light/40" />
        </div>
      )}

      <div>
        {rules.map((rule) => (
          <div key={rule.label} className="mt-2 flex items-center gap-2 first:mt-0">
            <Image
              src={rule.isValid ? "/images/checked-true.svg" : "/images/unchecked-true.svg"}
              alt={rule.isValid ? "Rule passed" : "Rule not passed"}
              width={15}
              height={15}
            />

            <span>{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
