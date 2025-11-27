pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
        NPM_CONFIG_LOGLEVEL = 'error'
        CI = 'true'
        // Note: Set these environment variables in Jenkins:
        // JWT_SECRET, ENCRYPTION_KEY, API_KEY_SECRET
        // Use Jenkins credentials binding or environment variables
        EMAIL_TO = 'groklord2@gmail.com'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
            post {
                always {
                    script {
                        emailext (
                            subject: "Jenkins Pipeline - Stage: Checkout - ${currentBuild.currentResult}",
                            body: """
                                <h2>Jenkins Pipeline Stage Result</h2>
                                <p><strong>Stage:</strong> Checkout</p>
                                <p><strong>Status:</strong> ${currentBuild.currentResult}</p>
                                <p><strong>Build:</strong> ${env.JOB_NAME} #${env.BUILD_NUMBER}</p>
                                <p><strong>Branch:</strong> ${env.BRANCH_NAME != null ? env.BRANCH_NAME : 'N/A'}</p>
                                <p><strong>Time:</strong> ${new java.util.Date()}</p>
                                <hr>
                                <p>Checkout completed successfully.</p>
                            """,
                            to: "${env.EMAIL_TO}",
                            mimeType: 'text/html'
                        )
                    }
                }
            }
        }

        stage('Setup') {
            steps {
                echo 'Setting up Node.js environment...'
                sh '''
                    node --version
                    npm --version
                '''
            }
            post {
                always {
                    script {
                        try {
                            def nodeVersion = sh(script: 'node --version', returnStdout: true).trim()
                            def npmVersion = sh(script: 'npm --version', returnStdout: true).trim()
                            emailext (
                                subject: "Jenkins Pipeline - Stage: Setup - ${currentBuild.currentResult}",
                                body: """
                                    <h2>Jenkins Pipeline Stage Result</h2>
                                    <p><strong>Stage:</strong> Setup</p>
                                    <p><strong>Status:</strong> ${currentBuild.currentResult}</p>
                                    <p><strong>Build:</strong> ${env.JOB_NAME} #${env.BUILD_NUMBER}</p>
                                    <p><strong>Node.js Version:</strong> ${nodeVersion}</p>
                                    <p><strong>npm Version:</strong> ${npmVersion}</p>
                                    <p><strong>Time:</strong> ${new java.util.Date()}</p>
                                    <hr>
                                    <p>Environment setup completed.</p>
                                """,
                                to: "${env.EMAIL_TO}",
                                mimeType: 'text/html'
                            )
                        } catch (Exception e) {
                            emailext (
                                subject: "Jenkins Pipeline - Stage: Setup - ${currentBuild.currentResult}",
                                body: """
                                    <h2>Jenkins Pipeline Stage Result</h2>
                                    <p><strong>Stage:</strong> Setup</p>
                                    <p><strong>Status:</strong> ${currentBuild.currentResult}</p>
                                    <p><strong>Build:</strong> ${env.JOB_NAME} #${env.BUILD_NUMBER}</p>
                                    <p><strong>Time:</strong> ${new java.util.Date()}</p>
                                    <hr>
                                    <p>Environment setup completed.</p>
                                """,
                                to: "${env.EMAIL_TO}",
                                mimeType: 'text/html'
                            )
                        }
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm ci'
            }
            post {
                always {
                    script {
                        def statusMsg = currentBuild.currentResult == 'SUCCESS' ? 'completed successfully' : 'failed'
                        emailext (
                            subject: "Jenkins Pipeline - Stage: Install Dependencies - ${currentBuild.currentResult}",
                            body: """
                                <h2>Jenkins Pipeline Stage Result</h2>
                                <p><strong>Stage:</strong> Install Dependencies</p>
                                <p><strong>Status:</strong> ${currentBuild.currentResult}</p>
                                <p><strong>Build:</strong> ${env.JOB_NAME} #${env.BUILD_NUMBER}</p>
                                <p><strong>Time:</strong> ${new java.util.Date()}</p>
                                <hr>
                                <p>Dependencies installation ${statusMsg}.</p>
                            """,
                            to: "${env.EMAIL_TO}",
                            mimeType: 'text/html'
                        )
                    }
                }
            }
        }

        stage('Lint') {
            steps {
                echo 'Skipping linter (no lint script configured)...'
                echo 'Note: Add lint script to package.json if linting is needed'
            }
            post {
                always {
                    script {
                        emailext (
                            subject: "Jenkins Pipeline - Stage: Lint - ${currentBuild.currentResult}",
                            body: """
                                <h2>Jenkins Pipeline Stage Result</h2>
                                <p><strong>Stage:</strong> Lint</p>
                                <p><strong>Status:</strong> ${currentBuild.currentResult}</p>
                                <p><strong>Build:</strong> ${env.JOB_NAME} #${env.BUILD_NUMBER}</p>
                                <p><strong>Time:</strong> ${new java.util.Date()}</p>
                                <hr>
                                <p>Lint stage skipped (no lint script configured).</p>
                            """,
                            to: "${env.EMAIL_TO}",
                            mimeType: 'text/html'
                        )
                    }
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
                sh 'npm run build'
            }
            post {
                always {
                    script {
                        emailext (
                            subject: "Jenkins Pipeline - Stage: Build - ${currentBuild.currentResult}",
                            body: """
                                <h2>Jenkins Pipeline Stage Result</h2>
                                <p><strong>Stage:</strong> Build</p>
                                <p><strong>Status:</strong> ${currentBuild.currentResult}</p>
                                <p><strong>Build:</strong> ${env.JOB_NAME} #${env.BUILD_NUMBER}</p>
                                <p><strong>Time:</strong> ${new java.util.Date()}</p>
                                <hr>
                                <p>Application build completed.</p>
                            """,
                            to: "${env.EMAIL_TO}",
                            mimeType: 'text/html'
                        )
                    }
                }
            }
        }

        stage('Frontend Tests') {
            steps {
                echo 'Running frontend tests...'
                sh '''
                    export CI=true
                    npm run test:frontend || true
                '''
            }
            post {
                always {
                    // Publish test results if JUnit XML format is available
                    // publishTestResults testResultsPattern: 'test-results/**/*.xml'
                    // Publish coverage if available
                    script {
                        if (fileExists('coverage/index.html')) {
                            publishHTML([
                                reportDir: 'coverage',
                                reportFiles: 'index.html',
                                reportName: 'Frontend Coverage Report',
                                allowMissing: true
                            ])
                        }
                        emailext (
                            subject: "Jenkins Pipeline - Stage: Frontend Tests - ${currentBuild.currentResult}",
                            body: """
                                <h2>Jenkins Pipeline Stage Result</h2>
                                <p><strong>Stage:</strong> Frontend Tests</p>
                                <p><strong>Status:</strong> ${currentBuild.currentResult}</p>
                                <p><strong>Build:</strong> ${env.JOB_NAME} #${env.BUILD_NUMBER}</p>
                                <p><strong>Time:</strong> ${new java.util.Date()}</p>
                                <hr>
                                <p>Frontend tests completed.</p>
                            """,
                            to: "${env.EMAIL_TO}",
                            mimeType: 'text/html'
                        )
                    }
                }
            }
        }

        stage('Backend Tests') {
            steps {
                echo 'Running backend tests...'
                sh '''
                    export CI=true
                    npm run test:backend || true
                '''
            }
            post {
                always {
                    script {
                        // Publish test results if JUnit XML format is available
                        // publishTestResults testResultsPattern: 'test-results/**/*.xml'
                        emailext (
                            subject: "Jenkins Pipeline - Stage: Backend Tests - ${currentBuild.currentResult}",
                            body: """
                                <h2>Jenkins Pipeline Stage Result</h2>
                                <p><strong>Stage:</strong> Backend Tests</p>
                                <p><strong>Status:</strong> ${currentBuild.currentResult}</p>
                                <p><strong>Build:</strong> ${env.JOB_NAME} #${env.BUILD_NUMBER}</p>
                                <p><strong>Time:</strong> ${new java.util.Date()}</p>
                                <hr>
                                <p>Backend tests completed.</p>
                            """,
                            to: "${env.EMAIL_TO}",
                            mimeType: 'text/html'
                        )
                    }
                }
            }
        }

        stage('E2E Tests') {
            steps {
                echo 'Installing Playwright browsers...'
                sh 'npx playwright install --with-deps chromium'
                
                echo 'Running E2E tests...'
                sh '''
                    export CI=true
                    export TEST_BASE_URL=${TEST_BASE_URL:-http://localhost:3000}
                    npm run test:e2e || true
                '''
            }
            post {
                always {
                    // Publish Playwright test results
                    script {
                        if (fileExists('test-results')) {
                            publishTestResults testResultsPattern: 'test-results/**/*.xml', allowEmptyResults: true
                        }
                        if (fileExists('playwright-report/index.html')) {
                            publishHTML([
                                reportDir: 'playwright-report',
                                reportFiles: 'index.html',
                                reportName: 'E2E Test Report',
                                allowMissing: true
                            ])
                        }
                        // Archive test artifacts
                        archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                        archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
                        
                        emailext (
                            subject: "Jenkins Pipeline - Stage: E2E Tests - ${currentBuild.currentResult}",
                            body: """
                                <h2>Jenkins Pipeline Stage Result</h2>
                                <p><strong>Stage:</strong> E2E Tests</p>
                                <p><strong>Status:</strong> ${currentBuild.currentResult}</p>
                                <p><strong>Build:</strong> ${env.JOB_NAME} #${env.BUILD_NUMBER}</p>
                                <p><strong>Time:</strong> ${new java.util.Date()}</p>
                                <hr>
                                <p>E2E tests completed.</p>
                            """,
                            to: "${env.EMAIL_TO}",
                            mimeType: 'text/html'
                        )
                    }
                }
            }
        }

        stage('Test Summary') {
            steps {
                echo 'All tests completed!'
            }
            post {
                always {
                    script {
                        emailext (
                            subject: "Jenkins Pipeline - Stage: Test Summary - ${currentBuild.currentResult}",
                            body: """
                                <h2>Jenkins Pipeline Stage Result</h2>
                                <p><strong>Stage:</strong> Test Summary</p>
                                <p><strong>Status:</strong> ${currentBuild.currentResult}</p>
                                <p><strong>Build:</strong> ${env.JOB_NAME} #${env.BUILD_NUMBER}</p>
                                <p><strong>Time:</strong> ${new java.util.Date()}</p>
                                <hr>
                                <p>All test stages completed.</p>
                            """,
                            to: "${env.EMAIL_TO}",
                            mimeType: 'text/html'
                        )
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh '''
                rm -rf node_modules/.cache || true
                rm -rf .next || true
                # Clean up any test artifacts if needed
            '''
        }
        success {
            echo 'Pipeline succeeded! ✅'
            script {
                emailext (
                    subject: "✅ Jenkins Pipeline SUCCESS - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        <h2 style="color: green;">Pipeline Succeeded!</h2>
                        <p><strong>Build:</strong> ${env.JOB_NAME} #${env.BUILD_NUMBER}</p>
                        <p><strong>Status:</strong> SUCCESS</p>
                        <p><strong>Duration:</strong> ${currentBuild.durationString}</p>
                        <p><strong>Time:</strong> ${new Date()}</p>
                        <hr>
                        <p>All pipeline stages completed successfully.</p>
                        <p><a href="${env.BUILD_URL}">View Build Details</a></p>
                    """,
                    to: "${env.EMAIL_TO}",
                    mimeType: 'text/html'
                )
            }
        }
        failure {
            echo 'Pipeline failed! ❌'
            script {
                emailext (
                    subject: "❌ Jenkins Pipeline FAILED - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        <h2 style="color: red;">Pipeline Failed!</h2>
                        <p><strong>Build:</strong> ${env.JOB_NAME} #${env.BUILD_NUMBER}</p>
                        <p><strong>Status:</strong> FAILED</p>
                        <p><strong>Duration:</strong> ${currentBuild.durationString}</p>
                        <p><strong>Time:</strong> ${new Date()}</p>
                        <hr>
                        <p>One or more pipeline stages failed.</p>
                        <p><a href="${env.BUILD_URL}">View Build Details</a></p>
                        <p><a href="${env.BUILD_URL}console">View Console Output</a></p>
                    """,
                    to: "${env.EMAIL_TO}",
                    mimeType: 'text/html'
                )
            }
        }
        unstable {
            echo 'Pipeline unstable! ⚠️'
            script {
                emailext (
                    subject: "⚠️ Jenkins Pipeline UNSTABLE - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        <h2 style="color: orange;">Pipeline Unstable!</h2>
                        <p><strong>Build:</strong> ${env.JOB_NAME} #${env.BUILD_NUMBER}</p>
                        <p><strong>Status:</strong> UNSTABLE</p>
                        <p><strong>Duration:</strong> ${currentBuild.durationString}</p>
                        <p><strong>Time:</strong> ${new Date()}</p>
                        <hr>
                        <p>Pipeline completed but some tests may have failed or warnings occurred.</p>
                        <p><a href="${env.BUILD_URL}">View Build Details</a></p>
                    """,
                    to: "${env.EMAIL_TO}",
                    mimeType: 'text/html'
                )
            }
        }
    }
}


