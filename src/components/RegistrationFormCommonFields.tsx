import React, { ReactNode } from "react";
import { Input } from "./Input";

interface RegistrationFormCommonFieldsProps {
  username: string;
  discordUsername: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  gitHubUsername: string;
  link?: string | undefined;
  avatar?: File | null | undefined;
  avatarInputRef: React.MutableRefObject<HTMLInputElement | undefined>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAvatar: () => void;
  usernameValidator: (value: string) => (string | ReactNode)[];
  discordUsernameValidator: (value: string) => (string | ReactNode)[];
  passwordValidator: (value: string) => (string | ReactNode)[];
  confirmPasswordValidator: (value: string) => (string | ReactNode)[];
  submitted: boolean;
}

export default function RegistrationFormCommonFields({
  username,
  discordUsername,
  emailAddress,
  password,
  confirmPassword,
  gitHubUsername,
  link,
  avatar,
  avatarInputRef,
  handleChange,
  handleAvatarChange,
  removeAvatar,
  usernameValidator,
  discordUsernameValidator,
  passwordValidator,
  confirmPasswordValidator,
  submitted,
}: RegistrationFormCommonFieldsProps) {
  return (
    <>
      <Input
        label="Code4rena Username"
        required={true}
        helpText={
          <>
            <strong>
              Choose wisely! Your username cannot be changed later.
            </strong>
            <br />
            Used to report findings, as well as display your total award amount
            on the leaderboard. Supports alphanumeric characters, underscores,
            and hyphens.
            <br />
            (Note: for consistency, please ensure your server nickname in our
            Discord matches the username you provide here)
          </>
        }
        name="username"
        aria-describedby={"username--error"}
        placeholder="Username"
        value={username}
        handleChange={handleChange}
        maxLength={25}
        validator={usernameValidator}
        forceValidation={submitted === true}
      />
      <Input
        label="Discord Username"
        required={true}
        name="discordUsername"
        aria-describedby={"discordUsername--error"}
        helpText="Used in case we need to contact you about your submissions or winnings."
        placeholder="Warden#1234"
        value={discordUsername}
        handleChange={handleChange}
        validator={discordUsernameValidator}
        forceValidation={submitted === true}
      />
      <Input
        label="Email Address"
        required={true}
        helpText="Used for sending confirmation emails for each of your submissions."
        name="emailAddress"
        aria-describedby={"emailAddress--error"}
        placeholder="warden@email.com"
        value={emailAddress}
        handleChange={handleChange}
        forceValidation={submitted === true}
      />
      <Input
        label="Password"
        required={true}
        helpText="Must be at least 18 characters long."
        name="password"
        aria-describedby={"password--error"}
        placeholder="Password"
        type="password"
        value={password}
        handleChange={handleChange}
        validator={passwordValidator}
        forceValidation={submitted === true}
      />
      <Input
        label="Confirm Password"
        required={true}
        name="confirmPassword"
        aria-describedby={"confirmPassword--error"}
        placeholder="Password"
        type="password"
        value={confirmPassword}
        handleChange={handleChange}
        validator={confirmPasswordValidator}
        forceValidation={submitted === true}
      />
      <Input
        label="GitHub Username"
        required={false}
        helpText="Used in case we need to give you access to certain repositories."
        name="gitHubUsername"
        aria-describedby={"gitHubUsername--error"}
        placeholder="Username"
        value={gitHubUsername}
        handleChange={handleChange}
      />
      <Input
        label="Link"
        required={false}
        helpText="Link your leaderboard entry to a personal website or social media account."
        name="link"
        aria-describedby={"link--error"}
        placeholder="https://twitter.com/code4rena"
        value={link || ""}
        handleChange={handleChange}
      />
      <fieldset>
        <label htmlFor="avatar">Avatar (Optional)</label>
        <p>An avatar displayed next to your name on the leaderboard.</p>
        <input
          className={"widget__avatar"}
          type="file"
          id="avatar"
          name="avatar"
          aria-describedby={"avatar--error"}
          accept=".png,.jpg,.jpeg,.webp"
          // @ts-ignore // @todo: fix typescript error
          ref={avatarInputRef}
          onChange={handleAvatarChange}
        />
        {avatar && (
          <button
            type="button"
            onClick={removeAvatar}
            aria-label="Remove avatar"
          >
            &#x2715;
          </button>
        )}
      </fieldset>
    </>
  );
}
